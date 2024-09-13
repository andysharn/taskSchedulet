const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Check if the token exists in the cookies
    const token = req.cookies.token; // Make sure you are using `cookie-parser`

    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded payload (user info) to the request
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
