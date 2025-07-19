import { Request, Response } from 'express';
import Gallery, { IGallery } from '../models/gallery.model';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Get all gallery items
 * @route   GET /api/gallery
 * @access  Public
 */
export const getAllGalleryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    // Filter by active status if specified
    if (req.query.active) {
      query.isActive = req.query.active === 'true';
    }

    // Filter by category if specified
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Filter by media type if specified
    if (req.query.mediaType) {
      query.mediaType = req.query.mediaType;
    }

    // Filter by event if specified
    if (req.query.event) {
      query.event = req.query.event;
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Get gallery items with pagination
    const galleryItems = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      total,
      pagination: {
        current: page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: galleryItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Get gallery item by ID
 * @route   GET /api/gallery/:id
 * @access  Public
 */
export const getGalleryItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      throw new AppError('Gallery item not found', 404);
    }

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Create new gallery item
 * @route   POST /api/gallery
 * @access  Private/Admin
 */
export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create gallery item
    const galleryItem = await Gallery.create(req.body);

    res.status(201).json({
      success: true,
      data: galleryItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Update gallery item
 * @route   PUT /api/gallery/:id
 * @access  Private/Admin
 */
export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find gallery item by ID
    let galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      throw new AppError('Gallery item not found', 404);
    }

    // Update gallery item
    galleryItem = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Delete gallery item
 * @route   DELETE /api/gallery/:id
 * @access  Private/Admin
 */
export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find gallery item by ID
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      throw new AppError('Gallery item not found', 404);
    }

    // Delete media file if it exists
    if (galleryItem.mediaUrl) {
      const mediaPath = path.join(__dirname, '../../uploads', galleryItem.mediaUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    }

    // Delete thumbnail file if it exists
    if (galleryItem.thumbnailUrl) {
      const thumbnailPath = path.join(__dirname, '../../uploads', galleryItem.thumbnailUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Delete gallery item from database
    await galleryItem.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Upload gallery media
 * @route   POST /api/gallery/:id/media
 * @access  Private/Admin
 */
export const uploadGalleryMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find gallery item by ID
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      throw new AppError('Gallery item not found', 404);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    // Delete old media file if it exists
    if (galleryItem.mediaUrl) {
      const oldMediaPath = path.join(__dirname, '../../uploads', galleryItem.mediaUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(oldMediaPath)) {
        fs.unlinkSync(oldMediaPath);
      }
    }

    // Determine media type from file mimetype
    const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';

    // Update gallery item with new media URL
    const mediaUrl = `/uploads/${mediaType === 'image' ? 'images' : 'videos'}/${req.file.filename}`;
    galleryItem.mediaUrl = mediaUrl;
    galleryItem.mediaType = mediaType;
    await galleryItem.save();

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Upload gallery thumbnail
 * @route   POST /api/gallery/:id/thumbnail
 * @access  Private/Admin
 */
export const uploadGalleryThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find gallery item by ID
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      throw new AppError('Gallery item not found', 404);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    // Delete old thumbnail file if it exists
    if (galleryItem.thumbnailUrl) {
      const oldThumbnailPath = path.join(__dirname, '../../uploads', galleryItem.thumbnailUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(oldThumbnailPath)) {
        fs.unlinkSync(oldThumbnailPath);
      }
    }

    // Update gallery item with new thumbnail URL
    const thumbnailUrl = `/uploads/images/${req.file.filename}`;
    galleryItem.thumbnailUrl = thumbnailUrl;
    await galleryItem.save();

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};