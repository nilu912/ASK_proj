import express from 'express';
import {
  submitRegistration,
  getEventRegistrations,
  getRegistrationStats,
  updateRegistrationStatus,
  deleteRegistration
} from '../controllers/registrationController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route - submit registration for an event
router.post('/events/:eventId/register', submitRegistration);

// Protected routes (Admin only)
router.use(protect, admin);

// Get all registrations for an event
router.get('/events/:eventId/registrations', getEventRegistrations);

// Get registration statistics for an event
router.get('/events/:eventId/registrations/stats', getRegistrationStats);

// Update registration status
router.patch('/registrations/:id/status', updateRegistrationStatus);

// Delete registration
router.delete('/registrations/:id', deleteRegistration);

export default router;
