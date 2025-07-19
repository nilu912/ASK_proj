import express from 'express';
import {
  login,
  logout,
  getMe,
  changePassword,
  createAdmin,
} from '../controllers/auth.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const createAdminValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Routes
router.post('/login', validate(loginValidation), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, validate(changePasswordValidation), changePassword);

// Admin only routes
router.post(
  '/create-admin',
  protect,
  adminOnly,
  validate(createAdminValidation),
  createAdmin
);

export default router;