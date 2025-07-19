import express from 'express';
import authRoutes from './auth.routes';
import directorRoutes from './director.routes';
import eventRoutes from './event.routes';
import galleryRoutes from './gallery.routes';
import inquiryRoutes from './inquiry.routes';
import donationRoutes from './donation.routes';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/directors', directorRoutes);
router.use('/events', eventRoutes);
router.use('/gallery', galleryRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/donations', donationRoutes);

export default router;