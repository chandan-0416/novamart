const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../errors/AppError');
const db = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token not found');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT.ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token has expired');
      }
      throw new UnauthorizedError('Invalid access token');
    }

    // Verify user still exists in database
    const userResult = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rowCount === 0) {
      throw new UnauthorizedError('User belonging to this token no longer exists');
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
