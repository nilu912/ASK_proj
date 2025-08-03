import express from 'express';
import {
  getHandlers,
  getHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  updateHandlerStatus,
  assignHandlerToEvent
} from '../controllers/handlerController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All handler routes are protected (Admin only)
router.use(protect, admin);

router.get('/', getHandlers);
router.get('/:id', getHandler);
router.post('/', createHandler);
router.put('/:id', updateHandler);
router.delete('/:id', deleteHandler);
router.patch('/:id/status', updateHandlerStatus);
router.post('/:id/assign', assignHandlerToEvent);

export default router;
