const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middlewares/authMiddleware');
const rbac = require('../middlewares/rbacMiddleware');
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
});
app.use('/api/', apiLimiter);
const router = express.Router();

router.get('/analytics', auth, rbac(['Admin']), getAnalytics,apiLimiter);

module.exports = router;
