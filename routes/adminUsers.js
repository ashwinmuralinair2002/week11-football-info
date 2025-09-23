// routes/adminUsers.js
const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/AdminController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');

const router = express.Router();
router.use(ensureAuthenticated, ensureAdmin);

router.get('/', AdminController.listUsers);
router.get('/create', AdminController.showCreateUserForm);
router.post(
  '/create',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['user','admin']).withMessage('Role must be user or admin'),
  ],
  AdminController.createUser
);
router.get('/:id/edit', AdminController.showEditForm);
router.post(
  '/:id/edit',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('role').isIn(['user','admin']).withMessage('Role must be user or admin'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters when provided'),
  ],
  AdminController.updateUser
);
router.post('/:id/delete', AdminController.deleteUser);

module.exports = router;
