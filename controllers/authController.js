const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const Task = require('../models/task');
const { sendConfirmationEmail } = require('./notificationController');
const argon2 = require('argon2');

const register = async (req, res) => {
    console.log("entered");
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const { username, email, password } = req.body;
        console.log(username, email);
        let user = await User.findOne({ email });
        console.log(user);
        if (user) return res.status(400).send('User already exists');

        user = new User({ username, email, password });
        console.log(user);

        user.save()
        .then(async savedUser => {
            console.log('User saved:', savedUser);
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Send the confirmation email after successful registration
            await sendConfirmationEmail(email, username);

            // Return the token to the user
            res.status(201).json({ token });
        })
        .catch(err => {
            console.error('Error saving user:', err);
            res.status(500).json({ msg: 'Server error' });
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Compare passwords
        const isMatch = await  argon2.verify(user.password,password,{ type: argon2.argon2id });
       
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expiration time
        });

        // Set JWT as a cookie (httpOnly for security)
        res.cookie('token', token, {
            httpOnly: true,      // Prevent access to the cookie via JavaScript (XSS protection)
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7200000      // Cookie expiration time (1 hour)

        });

        // Send response with token
        res.status(200).json({ msg: 'Login successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');  // Clear the JWT cookie
    res.status(200).json({ msg: 'Logout successful' });
};

const getProfile =  async (req, res) => {
    try {
        // Fetch the user profile from the database (excluding the password)
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Extract query parameters for filtering, sorting, and pagination
        const { status, priority, sortBy = 'dueDate', order = 'asc', limit = 5, page = 1 } = req.query;

        // Build the query object based on filtering criteria
        let query = { assignedTo: req.user.id };

        // Add status filter if provided (e.g., status=Pending)
        if (status) {
            query.status = status;
        }

        // Add priority filter if provided (e.g., priority=High)
        if (priority) {
            query.priority = priority;
        }

        // Calculate pagination variables
        const skip = (page - 1) * limit;

        // Fetch tasks based on query, sorting, and pagination
        const tasks = await Task.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })  // Sort by the specified field and order
            .skip(skip)  // Skip documents for pagination
            .limit(parseInt(limit));  // Limit the number of results

        // Return user profile and tasks in the response
        res.status(200).json({
            user,
            tasks,
            pagination: {
                currentPage: parseInt(page),
                totalTasks: await Task.countDocuments(query),
                totalPages: Math.ceil(await Task.countDocuments(query) / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching user profile and tasks:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
module.exports = { register, login, logout ,getProfile};
