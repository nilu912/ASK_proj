import { response } from "express";
import Handler from "../models/handlerModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @desc Get all handlers
// @route GET /api/handlers
// @access Private (Admin only)
export const getHandlers = async (req, res) => {
  try {

    const handlers = await User.find({role: "handler"});
    res.status(200).json({
      success: true,
      count: handlers.length,
      data: handlers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get single handler
// @route GET /api/handlers/:id
// @access Private (Admin only)
export const getHandler = async (req, res) => {
  try {
    const handler = await User.findById(req.params.id);

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: "Handler not found",
      });
    }

    res.status(200).json({
      success: true,
      data: handler,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Create new handler
// @route POST /api/handlers
// @access Private (Admin only)
export const createHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(500).json({ message: "User Already Exists!", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(name, email);
    const handler = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "handler",
    });
    // console.log(name, email);

    res.status(201).json({
      success: true,
      data: handler,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update handler
// @route PUT /api/handlers/:id
// @access Private (Admin only)
export const updateHandler = async (req, res) => {
  try {
    const handler = await Handler.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: "Handler not found",
      });
    }

    res.status(200).json({
      success: true,
      data: handler,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
        message: "Handler not found",
      });
    }

    await Handler.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Handler deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update handler status
// @route PATCH /api/handlers/:id/status
// @access Private (Admin only)
export const updateHandlerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      ![
        "active",
        "inactive",
        "on-leave",
        "terminated",
        "pending-approval",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
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
        message: "Handler not found",
      });
    }

    res.status(200).json({
      success: true,
      data: handler,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Assign handler to event
// @route POST /api/handlers/:id/assign
// @access Private (Admin only)
export const assignHandlerToEvent = async (req, res) => {
  try {
    const { eventId, title, description, startDate, endDate, status } =
      req.body;

    const handler = await Handler.findById(req.params.id);

    if (!handler) {
      return res.status(404).json({
        success: false,
        message: "Handler not found",
      });
    }

    handler.assignments.push({
      title,
      description,
      startDate,
      endDate,
      status,
      assignedBy: req.user.id,
      eventId,
    });

    await handler.save();

    res.status(200).json({
      success: true,
      message: "Handler assigned to event successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
