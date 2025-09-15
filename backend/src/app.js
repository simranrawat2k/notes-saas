const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);

module.exports = app;
