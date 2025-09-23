// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/signup', AuthController.showSignup);
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password >= 6 chars'),
  ],
  AuthController.signup
);

router.get('/login', AuthController.showLogin);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  AuthController.login
);

router.post('/logout', AuthController.logout);

module.exports = router;
