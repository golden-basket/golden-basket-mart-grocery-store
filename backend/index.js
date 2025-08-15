require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () =>
      logger.info(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => logger.error('MongoDB connection error:', err));
