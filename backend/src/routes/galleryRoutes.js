import express from 'express';
import {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGalleryItemStatus,
  likeGalleryItem,
  getFeaturedGalleryItems,
  addMediaToGalleryItem,
  deleteCategoryItem
} from '../controllers/galleryController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const uploadFields = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'media', maxCount: 20 },
]);

const router = express.Router();


// Public routes
router.get('/', getGalleryItems);
router.get('/featured', getFeaturedGalleryItems);
router.get('/:id', getGalleryItem);
router.post('/:id/like', likeGalleryItem);

// Protected routes (Admin only)
router.post('/', protect, admin, uploadFields, createGalleryItem);
router.put('/:id', protect, admin, updateGalleryItem);
router.put('/:id/add-media', protect, admin, addMediaToGalleryItem);
router.delete('/:id', protect, admin, deleteGalleryItem);
router.patch('/:id/status', protect, admin, updateGalleryItemStatus);
router.delete('/delCategory/:id', protect, admin, deleteCategoryItem);

export default router;
