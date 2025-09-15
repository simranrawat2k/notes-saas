// src/config/db.js
const mongoose = require('mongoose');

let isConnected = false; // cache the connection

async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is required');

  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log('MongoDB connected');
}

module.exports = connectDB;
