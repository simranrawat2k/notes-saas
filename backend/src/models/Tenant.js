// src/models/Tenant.js
const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free','pro'], default: 'free' },
  noteLimit: { type: Number, default: 3 }, 
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
