const express = require('express');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticRoutes');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', apiLimiter);

app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', analyticsRoutes);

module.exports = app;
