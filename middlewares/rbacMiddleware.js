const rbac = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).send('Request forbiddden');
    }
    next();
};

module.exports = rbac;
