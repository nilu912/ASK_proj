import express from 'express';
import {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  updateInquiryStatus,
  respondToInquiry
} from '../controllers/inquiryController.js';
import { protect, admin, handler } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createInquiry); // Allow public inquiries

// Protected routes (Admin only)
router.get('/', protect, handler, getInquiries);
router.get('/:id', protect, handler, getInquiry);
router.put('/:id', protect, handler, updateInquiry);
router.delete('/:id', protect, handler, deleteInquiry);
router.patch('/:id/status', protect, handler, updateInquiryStatus);
router.post('/:id/respond', protect, handler, respondToInquiry);

export default router;
