const express = require('express');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticRoutes');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', analyticsRoutes);

module.exports = app;
