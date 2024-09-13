const Task = require('../models/task');

const getAnalytics = async (req, res) => {
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const overdueTasks = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: 'Pending' });

    res.send({ completedTasks, pendingTasks, overdueTasks });
};

module.exports = { getAnalytics };
