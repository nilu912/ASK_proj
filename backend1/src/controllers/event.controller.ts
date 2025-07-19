import { Request, Response } from 'express';
import Event, { IEvent } from '../models/event.model';
import EventRegistration from '../models/eventRegistration.model';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    // Filter by active status if specified
    if (req.query.active) {
      query.isActive = req.query.active === 'true';
    }

    // Filter by upcoming events (date >= today)
    if (req.query.upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    // Filter by past events (date < today)
    if (req.query.past === 'true') {
      query.date = { $lt: new Date() };
    }

    // Get events with sorting by date (newest first)
    const events = await Event.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Get event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create event
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find event by ID
    let event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Delete image file if it exists
    if (event.image) {
      const imagePath = path.join(__dirname, '../../uploads', event.image.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete event from database
    await event.deleteOne();

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
 * @desc    Upload event image
 * @route   POST /api/events/:id/image
 * @access  Private/Admin
 */
export const uploadEventImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    // Delete old image if it exists
    if (event.image) {
      const oldImagePath = path.join(__dirname, '../../uploads', event.image.replace(/^.*\/uploads\//, ''));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update event with new image URL
    const imageUrl = `/uploads/images/${req.file.filename}`;
    event.image = imageUrl;
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

/**
 * @desc    Register for an event
 * @route   POST /api/events/:id/register
 * @access  Public
 */
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if event is active
    if (!event.isActive) {
      throw new AppError('This event is not active for registration', 400);
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      throw new AppError('This event has already passed', 400);
    }

    // Check if event has reached maximum participants
    if (event.maxParticipants && event.registeredParticipants !== undefined && event.registeredParticipants >= event.maxParticipants) {
      throw new AppError('This event has reached maximum capacity', 400);
    }

    // Create registration
    const registration = await EventRegistration.create({
      event: event._id,
      ...req.body,
    });

    // Increment registered participants count
    event.registeredParticipants = (event.registeredParticipants || 0) + 1;
    await event.save();

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid data provided',
    });
  }
};

/**
 * @desc    Get all registrations for an event
 * @route   GET /api/events/:id/registrations
 * @access  Private/Admin
 */
export const getEventRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Get registrations for this event
    const registrations = await EventRegistration.find({ event: event._id });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};