const { ForbiddenError } = require('../errors/AppError');

/**
 * Authorize users by role
 * @param  {...string} allowedRoles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource`));
    }
    next();
  };
};

module.exports = authorize;
