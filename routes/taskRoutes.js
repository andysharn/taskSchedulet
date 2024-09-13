const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');
const rbac = require('../middlewares/rbacMiddleware');
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
const router = express.Router();

router.post('/tasks', auth, rbac(['Admin', 'Manager']), createTask,apiLimiter);
router.get('/tasks', auth, getTasks,apiLimiter);
router.put('/tasks/:taskId', auth, rbac(['Admin', 'Manager']), updateTask,apiLimiter);
router.delete('/tasks/:taskId', auth, rbac(['Admin']), deleteTask,apilimiter);

module.exports = router;
