// src/config/db.js
const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
