import Event from "../models/eventModel.js";
import cloudinary from "../config/cloudinary.js";
import { streamUpload } from "../utils/cloudinaryUpload.js";
import {deleteFromCloudinary} from '../utils/deleteCloudinaryFile.js';
// @desc Get all events
// @route GET /api/events
// @access Public
export const getEvents = async (req, res) => {
  try {
    const { status, limit, sort } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .sort(sort === "startDate" ? { startDate: 1 } : { createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get single event
// @route GET /api/events/:id
// @access Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// // @desc Create new event
// // @route POST /api/events
// // @access Private (Admin only)
export const createEvent = async (req, res) => {
  try {
    let imageUrl = null,
      public_id = null;
    console.log("create event called");

    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      address,
      registrationDeadline,
      status,
      maxParticipants,
    } = req.body;

    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !address ||
      !startTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
      public_id = result.public_id;
      console.log("data upload result", result);
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      startTime,
      address: address,
      registrationDeadline,
      images: imageUrl ? [{ url: imageUrl, public_id }] : [],
      status: status || "Upcoming",
    });

    // Handle dynamic registration fields
    if (req.body.registrationFields) {
      try {
        const registrationFields =
          typeof req.body.registrationFields === "string"
            ? JSON.parse(req.body.registrationFields)
            : req.body.registrationFields;

        if (Array.isArray(registrationFields)) {
          event.registrationFields = registrationFields;
          await event.save();
        }
      } catch (error) {
        console.error("Error parsing registration fields:", error);
      }
    } else {
      // Set default registration fields if none provided
      event.registrationFields = [
        {
          id: "name",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name",
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "Enter your email",
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
          placeholder: "Enter your phone number",
        },
      ];
      await event.save();
    }

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// export const createEvent = async (req, res) => {
//   try {
//     const event = await Event.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: event
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// @desc Update event
// @route PUT /api/events/:id
// @access Private (Admin only)
export const updateEvent = async (req, res) => {
  console.log(req.body)
  
  // 1. Prepare the update data object
  let updateFields = { ...req.body }; // Start by copying all fields from req.body

  // OPTIONAL: Remove the redundant startTime field before updating (Recommended)
  if (updateFields.startTime) {
    delete updateFields.startTime;
  }
  
  // 2. Handle Image Upload
  let imageUrl = null;
  let public_id = null;

  if (req.file) {
    // Assuming streamUpload works correctly and returns { secure_url, public_id }
    const result = await streamUpload(req.file.buffer); 
    imageUrl = result.secure_url;
    public_id = result.public_id;
    console.log("data upload result", result);
    
    // Set the new image data
    updateFields.images = [{ url: imageUrl, public_id }];
  } else if (!req.file && updateFields.images) {
    // This is crucial: If no new file is uploaded, you likely want to keep existing images.
    // If you always want to clear old images when no new one is uploaded, use:
    updateFields.images = []; 
  }

  // 3. Handle Stringified registrationFields (Based on your console output)
  // Your console output shows registrationFields as stringified JSON:
  // "registrationFields[0]": "{\"id\":\"name\", ...}"
  // You need to parse these strings back into an array of objects.
  if (req.body['registrationFields[0]']) {
    const registrationFields = [];
    for (const key in req.body) {
      if (key.startsWith('registrationFields')) {
        try {
          registrationFields.push(JSON.parse(req.body[key]));
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    }
    // Add the parsed array to the update object
    updateFields.registrationFields = registrationFields;
    
    // Clean up the original stringified fields from updateFields
    for (const key in req.body) {
      if (key.startsWith('registrationFields')) {
        delete updateFields[key];
      }
    }
  }


  // 4. Execute the Mongoose Update
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      // CORRECTED: Spread the updateFields object so all fields are at the top level
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc Delete event
// @route DELETE /api/events/:id
// @access Private (Admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    const res = await deleteFromCloudinary(event.images[0].public_id)
    console.log(res)
    // await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update event status
// @route PATCH /api/events/:id/status
// @access Private (Admin only)
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Draft", "Published", "Cancelled", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get registration details
// @route GET /api/events/:id/register
// @access Private (Admin only)
export const getRegistrationDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event.registrationFields,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Register for event
// @route POST /api/events/:id/register
// @access Public
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: "Registration is not required for this event",
      });
    }

    // if (!event.isRegistrationOpen) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Registration is closed for this event'
    //   });
    // }

    // if (event.currentParticipants >= event.maxParticipants) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Event is fully booked'
    //   });
    // }

    // Increment participant count
    event.currentParticipants += 1;
    await event.save();

    res.status(200).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
