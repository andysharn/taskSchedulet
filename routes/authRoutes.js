const express = require('express');
const { register, login, logout ,getProfile} = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
const router = express.Router();

router.post('/register', register,apiLimiter);
router.post('/login', login,apiLimiter);
router.post('/logout', auth, logout,apiLimiter);
router.get('/profile', auth, getProfile,apiLimiter); 
module.exports = router;
