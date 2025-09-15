// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Connect to MongoDB
let isConnected = false;
connectDB(process.env.MONGODB_URI)
  .then(() => {
    isConnected = true;
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err);
  });

// Health check
app.get('/health', (req, res) => {
  if (isConnected) return res.json({ status: 'ok' });
  return res.status(500).json({ status: 'error', message: 'DB not connected' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);

module.exports = app;
