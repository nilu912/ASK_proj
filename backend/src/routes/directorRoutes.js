import express from 'express';
import {
  getDirectors,
  getDirector,
  createDirector,
  updateDirector,
  deleteDirector,
  updateDirectorStatus,
  reorderDirectors
} from '../controllers/directorController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js'; // Multer middleware

const router = express.Router();

// Public routes
router.get('/', getDirectors);
router.get('/:id', getDirector);

// Protected routes (Admin only)
router.post('/', protect, admin, upload.single('photo'), createDirector);
router.put('/:id', protect, admin, upload.single('photo'), updateDirector);
router.delete('/:id', protect, admin, deleteDirector);
router.patch('/:id/status', protect, admin, updateDirectorStatus);
router.patch('/reorder', protect, admin, reorderDirectors);

export default router;
