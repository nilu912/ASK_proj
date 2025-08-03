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
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createInquiry); // Allow public inquiries

// Protected routes (Admin only)
router.get('/', protect, admin, getInquiries);
router.get('/:id', protect, admin, getInquiry);
router.put('/:id', protect, admin, updateInquiry);
router.delete('/:id', protect, admin, deleteInquiry);
router.patch('/:id/status', protect, admin, updateInquiryStatus);
router.post('/:id/respond', protect, admin, respondToInquiry);

export default router;
