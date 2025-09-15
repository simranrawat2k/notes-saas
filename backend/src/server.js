// backend/src/server.js
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 8000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
