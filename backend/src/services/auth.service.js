const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const env = require('../config/env');
const ROLES = require('../constants/roles');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError
} = require('../errors/AppError');

/**
 * Generate Access Token & Refresh Token pair
 */
const generateTokenPair = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, env.JWT.ACCESS_SECRET, {
    expiresIn: env.JWT.ACCESS_EXPIRATION
  });

  const refreshToken = jwt.sign(payload, env.JWT.REFRESH_SECRET, {
    expiresIn: env.JWT.REFRESH_EXPIRATION
  });

  return { accessToken, refreshToken };
};

/**
 * Register a new user
 */
const register = async ({ name, email, password, role = ROLES.CUSTOMER }) => {
  // Check if user already exists
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    throw new ConflictError('A user with this email address already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert user
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash, role]
  );

  const newUser = result.rows[0];

  // Generate tokens
  const tokens = generateTokenPair(newUser);

  // Save refresh token to database
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [newUser.id, tokens.refreshToken, expiresAt]
  );

  return {
    user: newUser,
    tokens
  };
};

/**
 * Login user with email and password
 */
const login = async ({ email, password }) => {
  const result = await db.query(
    `SELECT id, name, email, password_hash, role, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  // Store refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, tokens.refreshToken, expiresAt]
  );

  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };

  return {
    user: userProfile,
    tokens
  };
};

/**
 * Refresh access and refresh tokens
 */
const refreshAccessToken = async (oldRefreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, env.JWT.REFRESH_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Check token existence in DB and if it's revoked
  const tokenQuery = await db.query(
    `SELECT id, user_id, is_revoked, expires_at
     FROM refresh_tokens
     WHERE token = $1`,
    [oldRefreshToken]
  );

  if (tokenQuery.rowCount === 0) {
    throw new UnauthorizedError('Refresh token not found');
  }

  const tokenRecord = tokenQuery.rows[0];

  if (tokenRecord.is_revoked || new Date(tokenRecord.expires_at) < new Date()) {
    throw new UnauthorizedError('Refresh token has expired or been revoked');
  }

  // Fetch current user
  const userResult = await db.query(
    `SELECT id, name, email, role FROM users WHERE id = $1`,
    [tokenRecord.user_id]
  );

  if (userResult.rowCount === 0) {
    throw new UnauthorizedError('User does not exist');
  }

  const user = userResult.rows[0];

  // Revoke old refresh token (Token rotation for best security)
  await db.query(
    `UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = $1`,
    [tokenRecord.id]
  );

  // Generate new pair
  const tokens = generateTokenPair(user);

  // Save new refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, tokens.refreshToken, expiresAt]
  );

  return {
    user,
    tokens
  };
};

/**
 * Revoke refresh token on logout
 */
const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await db.query(
    `UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1`,
    [refreshToken]
  );
};

/**
 * Get current user profile
 */
const getProfile = async (userId) => {
  const result = await db.query(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('User not found');
  }

  return result.rows[0];
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile
};
