import { Request, Response } from 'express';
import Donation, { IDonation } from '../models/donation.model';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Get all donations
 * @route   GET /api/donations
 * @access  Private/Admin
 */
export const getAllDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    // Filter by payment status if specified
    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
      query.paymentStatus = req.query.paymentStatus;
    }

    // Filter by payment method if specified
    if (req.query.paymentMethod && req.query.paymentMethod !== 'all') {
      query.paymentMethod = req.query.paymentMethod;
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      query.paymentDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get donations with pagination
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Donation.countDocuments(query);

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      pagination: {
        current: page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: donations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Get donation by ID
 * @route   GET /api/donations/:id
 * @access  Private/Admin
 */
export const getDonationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Create new donation
 * @route   POST /api/donations
 * @access  Public
 */
export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create donation
    const donation = await Donation.create(req.body);

    res.status(201).json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Update donation
 * @route   PUT /api/donations/:id
 * @access  Private/Admin
 */
export const updateDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find donation by ID
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    // Update donation
    donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Delete donation
 * @route   DELETE /api/donations/:id
 * @access  Private/Admin
 */
export const deleteDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find donation by ID
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    // Delete receipt file if it exists
    if (donation.receiptUrl) {
      const receiptPath = path.join(__dirname, '../../uploads', donation.receiptUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(receiptPath)) {
        fs.unlinkSync(receiptPath);
      }
    }

    // Delete donation from database
    await donation.deleteOne();

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
 * @desc    Upload donation receipt
 * @route   POST /api/donations/:id/receipt
 * @access  Private/Admin
 */
export const uploadDonationReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find donation by ID
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    // Delete old receipt file if it exists
    if (donation.receiptUrl) {
      const oldReceiptPath = path.join(__dirname, '../../uploads', donation.receiptUrl.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(oldReceiptPath)) {
        fs.unlinkSync(oldReceiptPath);
      }
    }

    // Update donation with new receipt URL
    const receiptUrl = `/uploads/documents/${req.file.filename}`;
    donation.receiptUrl = receiptUrl;
    await donation.save();

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Get donation statistics
 * @route   GET /api/donations/stats
 * @access  Private/Admin
 */
export const getDonationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total donations amount
    const totalResult = await Donation.aggregate([
      {
        $match: { paymentStatus: 'completed' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get donations by payment method
    const byMethodResult = await Donation.aggregate([
      {
        $match: { paymentStatus: 'completed' },
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get donations by month (last 12 months)
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    const byMonthResult = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          paymentDate: { $gte: lastYear },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$paymentDate' }, year: { $year: '$paymentDate' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format results
    const stats = {
      total: {
        amount: totalResult.length > 0 ? totalResult[0].total : 0,
        count: totalResult.length > 0 ? totalResult[0].count : 0,
      },
      byMethod: byMethodResult.map((item) => ({
        method: item._id,
        amount: item.total,
        count: item.count,
      })),
      byMonth: byMonthResult.map((item) => ({
        month: item._id.month,
        year: item._id.year,
        amount: item.total,
        count: item.count,
      })),
    };

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