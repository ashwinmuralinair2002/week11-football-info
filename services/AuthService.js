// services/AuthService.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  static async register({ name, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role });
    return user;
  }

  static async validateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
}

module.exports = AuthService;
