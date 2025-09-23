// controllers/AuthController.js
const { validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');

class AuthController {
  static showSignup(req, res) {
    res.render('signup', { errors: [], formData: {} });
  }

  static async signup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { errors: errors.array(), formData: req.body });
    }
    try {
      const user = await AuthService.register(req.body);
      req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
      req.session.flash = { type: 'success', message: 'Signed up successfully' };
      return res.redirect('/home');
    } catch (err) {
      if (err.code === 11000) {
        return res.render('signup', { errors: [{ msg: 'Email already in use' }], formData: req.body });
      }
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  static showLogin(req, res) {
    res.render('login', { errors: [], formData: {} });
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.render('login', { errors: errors.array(), formData: req.body });

    const { email, password } = req.body;
    const user = await AuthService.validateUser(email, password);
    if (!user) {
      return res.render('login', { errors: [{ msg: 'Invalid credentials' }], formData: req.body });
    }

    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    req.session.flash = { type: 'success', message: 'Signed up successfully' };
      return res.redirect('/home');
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
}

module.exports = AuthController;
