// models/Football.js
const mongoose = require('mongoose');

const footballSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type: { type: String, enum: ['club', 'player', 'match'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Football', footballSchema);
