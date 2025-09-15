const serverless = require('serverless-http');
const app = require('../backend/src/app');

module.exports = async (req, res) => {
  // Wrap the Express app with serverless-http
  const handler = serverless(app);
  return handler(req, res);
};
