import Inquiry from '../models/inquiryModel.js';

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
      .limit(limit ? parseInt(limit) : 0);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get single inquiry
// @route GET /api/inquiries/:id
// @access Private (Admin only)
export const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

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
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Create new inquiry
// @route POST /api/inquiries
// @access Public
export const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update inquiry status
// @route PATCH /api/inquiries/:id/status
// @access Private (Admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'in-progress', 'resolved', 'closed', 'spam'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
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
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Respond to inquiry
// @route POST /api/inquiries/:id/respond
// @access Private (Admin only)
export const respondToInquiry = async (req, res) => {
  try {
    const { message, responseType } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    inquiry.responses.push({
      message,
      respondedBy: req.user.id,
      responseType
    });

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
