import mongoose from 'mongoose';
import Registration from '../models/registrationModel.js';
import Event from '../models/eventModel.js';

// @desc Submit registration for an event
// @route POST /api/events/:eventId/register
// @access Public
export const submitRegistration = async (req, res) => {
  console.log("hello")
  try {
    const { eventId } = req.params;

    // Parse dynamic formData if it's stringified JSON
    let formData = req.body;
    if (typeof req.body.formData === 'string') {
      try {
        formData = JSON.parse(req.body.formData);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON in formData'
        });
      }
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Extract common contact fields if present (optional)
    const contactInfo = {
      name: formData.name || formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone || formData.phoneNumber || ''
    };

    // You can require name/email/phone if needed:
    // if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Name, email, and phone are required.'
    //   });
    // }

    // Optional: check max participants
    if (
      typeof event.maxParticipants === 'number' &&
      event.currentParticipants >= event.maxParticipants
    ) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      });
    }

    // Create and store registration
    const registration = await Registration.create({
      event: eventId,
      formData: formData, // dynamic fields preserved here
      contactInfo: contactInfo
    });

    // Update count
    event.currentParticipants += 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: registration
    });
  } catch (error) {
    console.error('Registration submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit registration',
      error: error.message
    });
  }
};


// @desc Get all registrations for an event (Admin only)
// @route GET /api/events/:eventId/registrations
// @access Private (Admin only)
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("hello")
    let { page = 1, limit = 10, status } = req.query;

    // Ensure numeric values
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));

    // Build query
    const query = { event: eventId };
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    // Fetch registrations
    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit),
      Registration.countDocuments(query)
    ]);

    // Format formData (convert Map to plain object) for each registration
    const formatted = registrations.map(reg => ({
      id: reg._id,
      eventId: reg.event, // just the ID
      contactInfo: reg.contactInfo, // name, email, phone
      formData: Object.fromEntries(reg.formData), // dynamic fields
      status: reg.status,
      submittedAt: reg.submittedAt,
      createdAt: reg.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
};

// @desc Get registration statistics for an event (Admin only)
// @route GET /api/events/:eventId/registrations/stats
// @access Private (Admin only)
export const getRegistrationStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const stats = await Registration.aggregate([
      { $match: { event: mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Get registration stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration statistics',
      error: error.message
    });
  }
};

// @desc Update registration status (Admin only)
// @route PATCH /api/registrations/:id/status
// @access Private (Admin only)
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('event', 'title startDate');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration status',
      error: error.message
    });
  }
};

// @desc Delete registration (Admin only)
// @route DELETE /api/registrations/:id
// @access Private (Admin only)
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Decrease participant count
    const event = await Event.findById(registration.event);
    if (event && event.currentParticipants > 0) {
      event.currentParticipants -= 1;
      await event.save();
    }

    await Registration.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully'
    });

  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete registration',
      error: error.message
    });
  }
};
