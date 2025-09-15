// src/seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Note = require('../models/Note');

async function main() {
  
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear existing
  await Tenant.deleteMany({});
  await User.deleteMany({});
  await Note.deleteMany({});

  // Create tenants: Acme and Globex
  const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free', noteLimit: 3 });
  const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free', noteLimit: 3 });

  const pw = await bcrypt.hash('password', 10);

  // admin@acme.test (Admin)
  await User.create({ email: 'admin@acme.test', password: pw, name: 'Acme Admin', role: 'admin', tenantId: acme._id });
  // user@acme.test (Member)
  await User.create({ email: 'user@acme.test', password: pw, name: 'Acme User', role: 'member', tenantId: acme._id });

  // admin@globex.test (Admin)
  await User.create({ email: 'admin@globex.test', password: pw, name: 'Globex Admin', role: 'admin', tenantId: globex._id });
  // user@globex.test (Member)
  await User.create({ email: 'user@globex.test', password: pw, name: 'Globex User', role: 'member', tenantId: globex._id });

  console.log('Seed complete');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
