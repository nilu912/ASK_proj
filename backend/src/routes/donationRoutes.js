import express from 'express';
import {
  getDonations,
  getDonation,
  createDonation,
  updateDonation,
  deleteDonation,
  updateDonationStatus,
  getDonationStatistics,
  sendThankYouEmail
} from '../controllers/donationController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createDonation); // Allow public donations

// Protected routes (Admin only)
router.get('/', protect, admin, getDonations);
router.get('/statistics', protect, admin, getDonationStatistics);
router.get('/:id', protect, admin, getDonation);
router.put('/:id', protect, admin, updateDonation);
router.delete('/:id', protect, admin, deleteDonation);
router.patch('/:id/status', protect, admin, updateDonationStatus);
router.post('/:id/thankyou', protect, admin, sendThankYouEmail);

export default router;
