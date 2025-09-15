// src/routes/tenants.js
const express = require('express');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// POST /api/tenants/:slug/upgrade
router.post('/:slug/upgrade', auth, roleCheck(['admin']), async (req, res) => {
  const { slug } = req.params;
  try {
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    // ensure requesting user belongs to same tenant
    if (tenant._id.toString() !== req.user.tenantId.toString()) {
      return res.status(403).json({ error: 'Cannot upgrade other tenant' });
    }

    tenant.plan = 'pro';
    tenant.noteLimit = null; 
    await tenant.save();

    return res.json({ message: 'Upgraded to Pro', tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
