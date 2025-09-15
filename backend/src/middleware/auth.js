// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload: { userId, tenantId, role, exp }
    const user = await User.findById(payload.userId).lean();
    if (!user) return res.status(401).json({ error: 'Invalid token user' });
    // Attach user and tenant info
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };
    // fetch tenant plan info for quick access
    req.tenant = await Tenant.findById(user.tenantId).lean();
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
