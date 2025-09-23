// scripts/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');

async function run() {
  try {
    await connectDB(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }
    const hashed = await bcrypt.hash('AdminPass123', 12);
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashed,
      role: 'admin'
    });
    console.log('Admin created:', admin.email, 'password: AdminPass123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message || err);
    process.exit(1);
  }
}

run();
