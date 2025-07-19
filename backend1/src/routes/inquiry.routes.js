import express from 'express';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  uploadInquiryAttachment,
  assignInquiry,
  getInquiryStats,
} from '../controllers/inquiry.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { body } from 'express-validator';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Validation rules
const inquiryValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').optional(),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
];

const updateInquiryValidation = [
  body('status').optional().isIn(['new', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('response').optional(),
];

const assignInquiryValidation = [
  body('userId').optional().isMongoId().withMessage('Invalid user ID'),
];

// Public routes
router.post('/', validate(inquiryValidation), createInquiry);
router.post('/:id/attachment', upload.single('attachment'), uploadInquiryAttachment);

// Protected routes (admin only)
router.use(protect, adminOnly);

router.get('/', getAllInquiries);
router.get('/stats', getInquiryStats);
router.get('/:id', getInquiryById);
router.put('/:id', validate(updateInquiryValidation), updateInquiry);
router.delete('/:id', deleteInquiry);
router.put('/:id/assign', validate(assignInquiryValidation), assignInquiry);

export default router;