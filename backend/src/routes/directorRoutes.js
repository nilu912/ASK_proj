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

import { protect, admin, protectForBoth } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js'; // Multer middleware

const router = express.Router();

// Public routes
router.get('/', getDirectors);
router.get('/:id', getDirector);

// Protected routes (Admin only)
router.post('/', protectForBoth, admin, upload.single('photo'), createDirector);
router.put('/:id', protectForBoth, admin, upload.single('photo'), updateDirector);
router.delete('/:id', protectForBoth, admin, deleteDirector);
router.patch('/:id/status', protectForBoth, admin, updateDirectorStatus);
router.patch('/reorder', protectForBoth, admin, reorderDirectors);

export default router;
