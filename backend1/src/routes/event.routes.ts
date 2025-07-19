import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventImage,
  registerForEvent,
  getEventRegistrations,
} from '../controllers/event.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body } from 'express-validator';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Validation rules
const eventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date format'),
  body('time').optional(),
  body('location').notEmpty().withMessage('Location is required'),
  body('registrationFee').optional().isNumeric().withMessage('Registration fee must be a number'),
  body('organizer').optional(),
  body('contactEmail').optional().isEmail().withMessage('Please provide a valid email'),
  body('contactPhone').optional(),
  body('maxParticipants').optional().isNumeric().withMessage('Max participants must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const registrationValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('address').optional(),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional(),
  body('idType').optional(),
  body('idNumber').optional(),
  body('notes').optional(),
  body('paymentStatus').optional(),
  body('paymentAmount').optional().isNumeric().withMessage('Payment amount must be a number'),
  body('paymentMethod').optional(),
  body('paymentReference').optional(),
];

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/:id/register', validate(registrationValidation), registerForEvent);

// Protected routes (admin only)
router.use(protect, adminOnly);

router.post('/', validate(eventValidation), createEvent);
router.put('/:id', validate(eventValidation), updateEvent);
router.delete('/:id', deleteEvent);

// Image upload route
router.post('/:id/image', upload.single('image'), uploadEventImage);

// Get event registrations
router.get('/:id/registrations', getEventRegistrations);

export default router;