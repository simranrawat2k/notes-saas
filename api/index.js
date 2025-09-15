const serverless = require('serverless-http');
const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

let isConnected;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB(process.env.MONGODB_URI);
      isConnected = true;
    } catch (err) {
      console.error('DB connection failed', err);
      return res.status(500).json({ error: 'DB connection failed' });
    }
  }
  const handler = serverless(app);
  return handler(req, res);
};
