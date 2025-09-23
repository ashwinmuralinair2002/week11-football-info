// controllers/FootballController.js
const Football = require('../models/Football');
const { validationResult } = require('express-validator');

function parsePositiveInt(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isFinite(n) && n > 0) return n;
  return fallback;
}

class FootballController {
  static async list(req, res) {
    const q = (req.query.q || '').trim();
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 10);

    const filter = q ? { title: { $regex: q, $options: 'i' } } : {};

    const total = await Football.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);

    const items = await Football.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();

    res.render('admin/footballList', {
      items,
      q,
      pagination: { total, limit, totalPages, currentPage },
    });
  }

  static showCreateForm(req, res) {
    res.render('admin/footballForm', { item: null, errors: [] });
  }

  static async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/footballForm', { item: req.body, errors: errors.array() });
    }
    try {
      await Football.create(req.body);
      req.session.flash = { type: 'success', message: 'Football entry saved' };
      res.redirect('/admin/football');
    } catch (err) {
      console.error(err);
      res.status(500).render('admin/footballForm', { item: req.body, errors: [{ msg: err.message }] });
    }
  }

  static async showEditForm(req, res) {
    const item = await Football.findById(req.params.id).lean();
    if (!item) return res.redirect('/admin/football');
    res.render('admin/footballForm', { item, errors: [] });
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const item = { ...req.body, _id: req.params.id };
      return res.status(422).render('admin/footballForm', { item, errors: errors.array() });
    }
    try {
      await Football.findByIdAndUpdate(req.params.id, req.body);
      req.session.flash = { type: 'success', message: 'Football entry updated' };
      res.redirect('/admin/football');
    } catch (err) {
      console.error(err);
      const item = { ...req.body, _id: req.params.id };
      res.status(500).render('admin/footballForm', { item, errors: [{ msg: err.message }] });
    }
  }

  static async delete(req, res) {
    try {
      await Football.findByIdAndDelete(req.params.id);
      req.session.flash = { type: 'success', message: 'Football entry deleted' };
      res.redirect('/admin/football');
    } catch (err) {
      console.error(err);
      req.session.flash = { type: 'error', message: 'Could not delete entry' };
      res.redirect('/admin/football');
    }
  }
}

module.exports = FootballController;
