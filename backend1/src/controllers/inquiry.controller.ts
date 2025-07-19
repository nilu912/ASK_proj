import { Request, Response } from 'express';
import Inquiry, { IInquiry } from '../models/inquiry.model';
import User from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Get all inquiries
 * @route   GET /api/inquiries
 * @access  Private/Admin
 */
export const getAllInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    // Filter by status if specified
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Filter by assigned user if specified
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get inquiries with pagination and populate assignedTo field
    const inquiries = await Inquiry.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      pagination: {
        current: page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: inquiries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Get inquiry by ID
 * @route   GET /api/inquiries/:id
 * @access  Private/Admin
 */
export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('assignedTo', 'name email');

    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Create new inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create inquiry
    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      data: inquiry,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Update inquiry
 * @route   PUT /api/inquiries/:id
 * @access  Private/Admin
 */
export const updateInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find inquiry by ID
    let inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }

    // If updating status to resolved, add response date
    if (req.body.status === 'resolved' && inquiry.status !== 'resolved') {
      req.body.responseDate = new Date();
    }

    // Update inquiry
    inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private/Admin
 */
export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find inquiry by ID
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }

    // Delete attachment file if it exists
    if (inquiry.attachmentUrl) {
      const attachmentPath = path.join(__dirname, '../../uploads', inquiry.attachmentUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(attachmentPath)) {
        fs.unlinkSync(attachmentPath);
      }
    }

    // Delete inquiry from database
    await inquiry.deleteOne();

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
 * @desc    Upload inquiry attachment
 * @route   POST /api/inquiries/:id/attachment
 * @access  Public
 */
export const uploadInquiryAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find inquiry by ID
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    // Delete old attachment file if it exists
    if (inquiry.attachmentUrl) {
      const oldAttachmentPath = path.join(__dirname, '../../uploads', inquiry.attachmentUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(oldAttachmentPath)) {
        fs.unlinkSync(oldAttachmentPath);
      }
    }

    // Determine file type and directory
    let fileDir = 'documents';
    if (req.file.mimetype.startsWith('image/')) {
      fileDir = 'images';
    }

    // Update inquiry with new attachment URL
    const attachmentUrl = `/uploads/${fileDir}/${req.file.filename}`;
    inquiry.attachmentUrl = attachmentUrl;
    await inquiry.save();

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Assign inquiry to user
 * @route   PUT /api/inquiries/:id/assign
 * @access  Private/Admin
 */
export const assignInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    // Check if user exists
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
    }

    // Find inquiry by ID
    let inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }

    // Update inquiry with assigned user
    inquiry.assignedTo = userId || undefined;
    inquiry.status = userId ? 'in-progress' : inquiry.status;
    await inquiry.save();

    // Populate assignedTo field
    inquiry = await Inquiry.findById(req.params.id).populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Get inquiry statistics
 * @route   GET /api/inquiries/stats
 * @access  Private/Admin
 */
export const getInquiryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get counts by status
    const statusCounts = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format status counts
    const stats = {
      total: 0,
      new: 0,
      'in-progress': 0,
      resolved: 0,
      closed: 0,
    };

    statusCounts.forEach((item) => {
      stats[item._id as keyof typeof stats] = item.count;
      stats.total += item.count;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};