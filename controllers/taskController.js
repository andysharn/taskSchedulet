const Task = require('../models/task');
const User = require('../models/user'); 
const { sendTaskNotification,notifyTaskUpdate } = require('./notificationController');
const redisClient = require('../utils/cache'); // Adjust the path as needed

const clearCache = async (query) => {
    const cacheKeys = [`tasks:${JSON.stringify(query)}:*`];

    for (const key of cacheKeys) {
        const keys = await redisClient.keys(key);
        for (const k of keys) {
            await redisClient.del(k);
        }
    }
};

const getTasks = async (req, res) => {
    try {
        const { status, priority, sortBy = 'dueDate', order = 'asc', limit = 5, page = 1 } = req.query;

        // Build the query object based on filtering criteria
        let query = { createdBy: req.user.id };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        // Calculate pagination variables
        const skip = (page - 1) * limit;
        const cacheKey = `tasks:${JSON.stringify(query)}:${sortBy}:${order}:${limit}:${page}`;

        // Check Redis cache
        const cachedTasks = await redisClient.get(cacheKey);

        if (cachedTasks) {
            return res.status(200).json(JSON.parse(cachedTasks));
        }

        // Fetch tasks from database
        const tasks = await Task.find(query)
            .populate('assignedTo')
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalTasks = await Task.countDocuments(query);

        const response = {
            tasks,
            pagination: {
                currentPage: parseInt(page),
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
            }
        };

        // Cache the result with an expiration time (e.g., 1 hour)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

        // Return the tasks and pagination info in the response
        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};


const createTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = new Task({
        title, description, dueDate, priority, assignedTo, createdBy: req.user.id
    });

    try {
        await task.save();

        // Notify via Socket.io and Email
        notifyTaskUpdate(task._id, 'created');
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            await sendTaskNotification(assignedUser.email, task.title, 'created');
        }

        // Clear relevant cache
        await clearCache({ createdBy: req.user.id });

        res.status(201).send(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Server error');
    }
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, createdBy: req.user.id },
            { title, description, status },
            { new: true }
        );

        if (!task) return res.status(404).send('Task not found');

        notifyTaskUpdate(task._id, 'updated');
        if (task.assignedTo) {
            const assignedUser = await User.findById(task.assignedTo);
            if(status=='Completed')
               await sendTaskNotification(assignedUser.email, task.title, 'completed');
           
            else 
               await sendTaskNotification(assignedUser.email, task.title, 'updated');
                
        }

        // Clear relevant cache
        await clearCache({ createdBy: req.user.id });

        res.send(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Server error');
    }
};

const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, createdBy: req.user.id });
        if (!task) return res.status(404).send('Task not found');

        notifyTaskUpdate(task._id, 'deleted');

        // Clear relevant cache
        await clearCache({ createdBy: req.user.id });

        res.send('Task deleted');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Server error');
    }
};


module.exports = { createTask, getTasks, updateTask, deleteTask };
