// controllers/AdminController.js
const User = require('../models/User');
const AuthService = require('../services/AuthService');
const { validationResult } = require('express-validator');

function parsePositiveInt(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isFinite(n) && n > 0) return n;
  return fallback;
}

class AdminController {
  static async listUsers(req, res) {
    const q = (req.query.q || '').trim();
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 10);

    const filter = q
      ? { $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] }
      : {};

    const total = await User.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();

    res.render('admin/users', {
      users,
      q,
      pagination: { total, limit, totalPages, currentPage },
    });
  }

  static showCreateUserForm(req, res) {
    res.render('admin/editUser', { user: null, errors: [] });
  }

  static async createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/editUser', { user: req.body, errors: errors.array() });
    }
    const { name, email, password, role } = req.body;
    try {
      await AuthService.register({ name, email, password, role: role || 'user' });
      req.session.flash = { type: 'success', message: 'User created' };
      return res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      return res.status(500).render('admin/editUser', { user: req.body, errors: [{ msg: err.message || 'Could not create' }] });
    }
  }

  static async showEditForm(req, res) {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.redirect('/admin/users');
    res.render('admin/editUser', { user, errors: [] });
  }

  static async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const user = { ...req.body, _id: req.params.id };
      return res.status(422).render('admin/editUser', { user, errors: errors.array() });
    }

    const { name, email, role } = req.body;
    try {
      await User.findByIdAndUpdate(req.params.id, { name, email, role });
      if (req.body.password && req.body.password.length >= 6) {
        await AuthService.updateUserPassword(req.params.id, req.body.password);
      }
      req.session.flash = { type: 'success', message: 'User updated' };
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      const user = { ...req.body, _id: req.params.id };
      res.status(500).render('admin/editUser', { user, errors: [{ msg: err.message || 'Could not update' }] });
    }
  }

  static async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      req.session.flash = { type: 'success', message: 'User deleted' };
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      req.session.flash = { type: 'error', message: 'Could not delete user' };
      res.redirect('/admin/users');
    }
  }
}

module.exports = AdminController;
