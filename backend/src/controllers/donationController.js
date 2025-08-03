import Donation from '../models/donationModel.js';

// @desc Get all donations
// @route GET /api/donations
// @access Public
export const getDonations = async (req, res) => {
  try {
    const { status, category, limit, sort } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const donations = await Donation.find(query)
      .sort(sort === 'date' ? { createdAt: -1 } : { amount: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get single donation
// @route GET /api/donations/:id
// @access Public
export const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Create new donation
// @route POST /api/donations
// @access Private (Admin only)
export const createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update donation
// @route PUT /api/donations/:id
// @access Private (Admin only)
export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Delete donation
// @route DELETE /api/donations/:id
// @access Private (Admin only)
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update donation status
// @route PATCH /api/donations/:id/status
// @access Private (Admin only)
export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'failed', 'refunded', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get donation statistics
// @route GET /api/donations/statistics
// @access Private (Admin only)
export const getDonationStatistics = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: totalDonations[0] || { total: 0, count: 0 }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Send thank you email for donation
// @route POST /api/donations/:id/thankyou
// @access Private (Admin only)
export const sendThankYouEmail = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation || donation.status !== 'completed') {
      return res.status(404).json({
        success: false,
        message: 'Completed donation not found'
      });
    }

    // TODO: Implement email sending logic

    res.status(200).json({
      success: true,
      message: 'Thank you email sent'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
