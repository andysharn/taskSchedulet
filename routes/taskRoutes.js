const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');
const rbac = require('../middlewares/rbacMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

router.post('/tasks', auth, rbac(['Admin', 'Manager']), createTask);
router.get('/tasks', auth, getTasks);
router.put('/tasks/:taskId', auth, rbac(['Admin', 'Manager']), updateTask);
router.delete('/tasks/:taskId', auth, rbac(['Admin']), deleteTask);

module.exports = router;
