import express from 'express';
import {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
  uploadDirectorPhoto,
} from '../controllers/director.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { body } from 'express-validator';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Validation rules
const directorValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('bio').optional(),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional(),
  body('socialMedia').optional().isObject().withMessage('Social media must be an object'),
  body('order').optional().isNumeric().withMessage('Order must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

// Public routes
router.get('/', getAllDirectors);
router.get('/:id', getDirectorById);

// Protected routes (admin only)
router.use(protect, adminOnly);

router.post('/', validate(directorValidation), createDirector);
router.put('/:id', validate(directorValidation), updateDirector);
router.delete('/:id', deleteDirector);

// Photo upload route
router.post('/:id/photo', upload.single('photo'), uploadDirectorPhoto);

export default router;