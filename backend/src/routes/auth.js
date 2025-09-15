// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '7d';

const router = express.Router();

// Login endpoint
// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

// sign token with userId, tenantId, tenantSlug, role
const tenant = await Tenant.findById(user.tenantId);
const token = jwt.sign({
  userId: user._id,
  tenantId: user.tenantId,
  tenantSlug: tenant.slug,   
  role: user.role
}, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });


 res.json({
  token,
  user: {
    id: user._id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    tenantSlug: tenant.slug 
  }
});

});

module.exports = router;
