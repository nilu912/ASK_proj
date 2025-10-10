import Inquiry from '../models/inquiryModel.js';
import { sendInquiryResponse, sendInquiryConfirmation } from '../services/emailService.js';

// @desc Get all inquiries
// @route GET /api/inquiries
// @access Private (Admin only)
export const getInquiries = async (req, res) => {
  try {
    const { status, category, priority, limit, sort } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const inquiries = await Inquiry.find(query)
      .sort(sort === 'date' ? { createdAt: -1 } : { priority: 1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0)
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries',
      error: error.message
    });
  }
};

// @desc Get single inquiry
// @route GET /api/inquiries/:id
// @access Private (Admin only)
export const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email')
      .populate('responses.respondedBy', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry',
      error: error.message
    });
  }
};

// @desc Create new inquiry
// @route POST /api/inquiries
// @access Public
export const createInquiry = async (req, res) => {
  try {
    // Extract IP and User Agent from request
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const inquiryData = {
      ...req.body,
      ipAddress,
      userAgent,
      status: 'new'
    };

    const inquiry = await Inquiry.create(inquiryData);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create inquiry',
      error: error.message
    });
  }
};

// @desc Update inquiry
// @route PUT /api/inquiries/:id
// @access Private (Admin only)
export const updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry',
      error: error.message
    });
  }
};

// @desc Delete inquiry
// @route DELETE /api/inquiries/:id
// @access Private (Admin only)
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry',
      error: error.message
    });
  }
};

// @desc Update inquiry status
// @route PATCH /api/inquiries/:id/status
// @access Private (Admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['new', 'in-progress', 'resolved', 'closed', 'spam'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateData = { status };
    
    // If status is resolved or closed, update resolved fields
    if (status === 'resolved' || status === 'closed') {
      updateData.resolved = true;
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user?.id;
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};

// @desc Update inquiry priority
// @route PATCH /api/inquiries/:id/priority
// @access Private (Admin only)
export const updateInquiryPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority value. Must be one of: ${validPriorities.join(', ')}`
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Priority updated successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error updating inquiry priority:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update priority',
      error: error.message
    });
  }
};

// @desc Respond to inquiry
// @route POST /api/inquiries/:id/respond
// @access Private (Admin only)
export const respondToInquiry = async (req, res) => {
  try {
    const { message, responseType = 'email' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    inquiry.responses.push({
      message: message.trim(),
      respondedBy: req.user.id,
      responseType
    });

    // Update first response time if this is the first response
    if (inquiry.responses.length === 1) {
      inquiry.firstResponseTime = new Date();
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

// @desc Assign inquiry to handler
// @route PATCH /api/inquiries/:id/assign
// @access Private (Admin only)
export const assignInquiry = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Handler ID is required'
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry assigned successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error assigning inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign inquiry',
      error: error.message
    });
  }
};

// @desc Get inquiry statistics
// @route GET /api/inquiries/stats
// @access Private (Admin only)
export const getInquiryStats = async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const inProgressInquiries = await Inquiry.countDocuments({ status: 'in-progress' });
    const resolvedInquiries = await Inquiry.countDocuments({ status: 'resolved' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });

    const stats = {
      total: totalInquiries,
      new: newInquiries,
      inProgress: inProgressInquiries,
      resolved: resolvedInquiries,
      closed: closedInquiries,
      byPriority: {
        low: await Inquiry.countDocuments({ priority: 'low' }),
        medium: await Inquiry.countDocuments({ priority: 'medium' }),
        high: await Inquiry.countDocuments({ priority: 'high' }),
        urgent: await Inquiry.countDocuments({ priority: 'urgent' })
      },
      byCategory: {}
    };

    // Get counts by category
    const categories = ['general', 'volunteering', 'donation', 'event', 'complaint', 'suggestion', 'partnership', 'media', 'other'];
    for (const category of categories) {
      stats.byCategory[category] = await Inquiry.countDocuments({ category });
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};