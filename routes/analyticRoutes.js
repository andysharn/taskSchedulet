const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middlewares/authMiddleware');
const rbac = require('../middlewares/rbacMiddleware');

const router = express.Router();

router.get('/analytics', auth, rbac(['Admin']), getAnalytics);

module.exports = router;
