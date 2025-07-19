import { Request, Response } from 'express';
import Director, { IDirector } from '../models/director.model';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Get all directors
 * @route   GET /api/directors
 * @access  Public
 */
export const getAllDirectors = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    // Filter by active status if specified
    if (req.query.active) {
      query.isActive = req.query.active === 'true';
    }

    // Get directors with sorting by order
    const directors = await Director.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: directors.length,
      data: directors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Get director by ID
 * @route   GET /api/directors/:id
 * @access  Public
 */
export const getDirectorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      throw new AppError('Director not found', 404);
    }

    res.status(200).json({
      success: true,
      data: director,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Create new director
 * @route   POST /api/directors
 * @access  Private/Admin
 */
export const createDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create director
    const director = await Director.create(req.body);

    res.status(201).json({
      success: true,
      data: director,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Update director
 * @route   PUT /api/directors/:id
 * @access  Private/Admin
 */
export const updateDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find director by ID
    let director = await Director.findById(req.params.id);

    if (!director) {
      throw new AppError('Director not found', 404);
    }

    // Update director
    director = await Director.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: director,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Delete director
 * @route   DELETE /api/directors/:id
 * @access  Private/Admin
 */
export const deleteDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find director by ID
    const director = await Director.findById(req.params.id);

    if (!director) {
      throw new AppError('Director not found', 404);
    }

    // Delete photo file if it exists
    if (director.photo) {
      const photoPath = path.join(__dirname, '../../uploads', director.photo.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Delete director from database
    await director.deleteOne();

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
 * @desc    Upload director photo
 * @route   POST /api/directors/:id/photo
 * @access  Private/Admin
 */
export const uploadDirectorPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find director by ID
    const director = await Director.findById(req.params.id);

    if (!director) {
      throw new AppError('Director not found', 404);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    // Delete old photo if it exists
    if (director.photo) {
      const oldPhotoPath = path.join(__dirname, '../../uploads', director.photo.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update director with new photo URL
    const photoUrl = `/uploads/images/${req.file.filename}`;
    director.photo = photoUrl;
    await director.save();

    res.status(200).json({
      success: true,
      data: director,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};