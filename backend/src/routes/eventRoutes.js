import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  registerForEvent,
  getRegistrationDetails
} from '../controllers/eventController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js'; // Multer middleware

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/:id/register', registerForEvent);

// Protected routes (Admin only)
router.post('/', protect, admin, upload.single('image'), createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);
router.patch('/:id/status', protect, admin, updateEventStatus);

export default router;
