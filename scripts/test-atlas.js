require('dotenv').config();
const mongoose = require('mongoose');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { /* defaults fine for driver v4+ */ });
    console.log('Connected OK');
    await mongoose.disconnect();
  } catch (err) {
    console.error('CONNECT ERROR:', err);
  } finally {
    process.exit(0);
  }
})();
