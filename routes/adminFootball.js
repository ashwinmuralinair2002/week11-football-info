// routes/adminFootball.js
const express = require('express');
const { body } = require('express-validator');
const FootballController = require('../controllers/FootballController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');

const router = express.Router();
router.use(ensureAuthenticated, ensureAdmin);

router.get('/', FootballController.list);
router.get('/create', FootballController.showCreateForm);
router.post(
  '/create',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('type').isIn(['club','player','match']).withMessage('Type must be club, player, or match'),
  ],
  FootballController.create
);
router.get('/:id/edit', FootballController.showEditForm);
router.post(
  '/:id/edit',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('type').isIn(['club','player','match']).withMessage('Type must be club, player, or match'),
  ],
  FootballController.update
);
router.post('/:id/delete', FootballController.delete);

module.exports = router;
