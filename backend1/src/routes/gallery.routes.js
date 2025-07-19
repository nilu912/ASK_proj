import express from 'express';
import {
  getAllGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadGalleryMedia,
  uploadGalleryThumbnail,
} from '../controllers/gallery.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { body } from 'express-validator';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Validation rules
const galleryValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('mediaType').isIn(['image', 'video']).withMessage('Media type must be either image or video'),
  body('category').isIn(['events', 'activities', 'success', 'facilities']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('event').optional().isMongoId().withMessage('Invalid event ID'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

// Public routes
router.get('/', getAllGalleryItems);
router.get('/:id', getGalleryItemById);

// Protected routes (admin only)
router.use(protect, adminOnly);

router.post('/', validate(galleryValidation), createGalleryItem);
router.put('/:id', validate(galleryValidation), updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

// Media upload routes
router.post('/:id/media', upload.single('media'), uploadGalleryMedia);
router.post('/:id/thumbnail', upload.single('thumbnail'), uploadGalleryThumbnail);

export default router;