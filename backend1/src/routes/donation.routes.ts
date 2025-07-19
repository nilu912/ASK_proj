import express from 'express';
import {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  uploadDonationReceipt,
  getDonationStats,
} from '../controllers/donation.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body } from 'express-validator';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Validation rules
const donationValidation = [
  body('donorName').notEmpty().withMessage('Donor name is required'),
  body('donorEmail').isEmail().withMessage('Please provide a valid email'),
  body('donorPhone').optional(),
  body('donorAddress').optional(),
  body('donorIdType').optional(),
  body('donorIdNumber').optional(),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentStatus').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status'),
  body('paymentMethod').optional(),
  body('paymentReference').optional(),
  body('paymentDate').optional().isISO8601().withMessage('Invalid date format'),
  body('notes').optional(),
];

const updateDonationValidation = [
  body('paymentStatus').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status'),
  body('paymentMethod').optional(),
  body('paymentReference').optional(),
  body('paymentDate').optional().isISO8601().withMessage('Invalid date format'),
  body('notes').optional(),
];

// Public routes
router.post('/', validate(donationValidation), createDonation);

// Protected routes (admin only)
router.use(protect, adminOnly);

router.get('/', getAllDonations);
router.get('/stats', getDonationStats);
router.get('/:id', getDonationById);
router.put('/:id', validate(updateDonationValidation), updateDonation);
router.delete('/:id', deleteDonation);
router.post('/:id/receipt', upload.single('receipt'), uploadDonationReceipt);

export default router;