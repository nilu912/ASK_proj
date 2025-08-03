import Handler from '../models/handlerModel.js';

// @desc Get all handlers
// @route GET /api/handlers
// @access Private (Admin only)
export const getHandlers = async (req, res) => {
  try {
    const { status, role, department, limit, sort } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (role) query.role = role;
    if (department) query.department = department;

    const handlers = await Handler.find(query)
      .sort(sort === 'name' ? { name: 1 } : { createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.status(200).json({
      success: true,
      count: handlers.length,
      data: handlers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get single handler
// @route GET /api/handlers/:id
// @access Private (Admin only)
export const getHandler = async (req, res) => {
  try {
    const handler = await Handler.findById(req.params.id);

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: 'Handler not found'
      });
    }

    res.status(200).json({
      success: true,
      data: handler
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Create new handler
// @route POST /api/handlers
// @access Private (Admin only)
export const createHandler = async (req, res) => {
  try {
    const handler = await Handler.create(req.body);

    res.status(201).json({
      success: true,
      data: handler
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update handler
// @route PUT /api/handlers/:id
// @access Private (Admin only)
export const updateHandler = async (req, res) => {
  try {
    const handler = await Handler.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: 'Handler not found'
      });
    }

    res.status(200).json({
      success: true,
      data: handler
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Delete handler
// @route DELETE /api/handlers/:id
// @access Private (Admin only)
export const deleteHandler = async (req, res) => {
  try {
    const handler = await Handler.findById(req.params.id);

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: 'Handler not found'
      });
    }

    await Handler.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Handler deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update handler status
// @route PATCH /api/handlers/:id/status
// @access Private (Admin only)
export const updateHandlerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'on-leave', 'terminated', 'pending-approval'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const handler = await Handler.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: 'Handler not found'
      });
    }

    res.status(200).json({
      success: true,
      data: handler
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Assign handler to event
// @route POST /api/handlers/:id/assign
// @access Private (Admin only)
export const assignHandlerToEvent = async (req, res) => {
  try {
    const { eventId, title, description, startDate, endDate, status } = req.body;

    const handler = await Handler.findById(req.params.id);

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: 'Handler not found'
      });
    }

    handler.assignments.push({
      title,
      description,
      startDate,
      endDate,
      status,
      assignedBy: req.user.id,
      eventId
    });

    await handler.save();

    res.status(200).json({
      success: true,
      message: 'Handler assigned to event successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
