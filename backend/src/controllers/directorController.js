import Director from '../models/directorModel.js';
import cloudinary from '../config/cloudinary.js';
import { streamUpload } from '../utils/cloudinaryUpload.js';

// @desc Get all directors
// @route GET /api/directors
// @access Public
export const getDirectors = async (req, res) => {
  try {
    const { status, limit, sort } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const directors = await Director.find(query)
      .sort(sort === 'name' ? { name: 1 } : { displayOrder: 1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.status(200).json({
      success: true,
      count: directors.length,
      data: directors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get single director
// @route GET /api/directors/:id
// @access Public
export const getDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    res.status(200).json({
      success: true,
      data: director
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Create new director
// @route POST /api/directors
// @access Private (Admin only)

export const createDirector = async (req, res) => {
  try {
    let photoUrl = null;

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const director = await Director.create({
      ...req.body,
      photo: photoUrl,
    });

    res.status(201).json({ success: true, data: director });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};


// export const createDirector = async (req, res) => {
//   try {
//     const director = await Director.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: director
//     });
//   } catch (error) {
//     // Handle duplicate email error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists'
//       });
//     }

//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// @desc Update director
// @route PUT /api/directors/:id
// @access Private (Admin only)
export const updateDirector = async (req, res) => {
  try {
    let updateData = { ...req.body };
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({ success: false, message: 'Director not found' });
    }

    // Upload new photo if file exists
    if (req.file) {
      // Delete previous image if exists
      if (director.photo) {
        const publicId = director.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`directors/${publicId}`);
      }

      const result = await cloudinary.uploader.upload_stream(
        { folder: 'directors' },
        (error, result) => {
          if (error) throw new Error(error.message);
          updateData.photo = result.secure_url;
        }
      );
      result.end(req.file.buffer);
    }

    const updatedDirector = await Director.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updatedDirector });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// export const updateDirector = async (req, res) => {
//   try {
//     const director = await Director.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     if (!director) {
//       return res.status(404).json({
//         success: false,
//         message: 'Director not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: director
//     });
//   } catch (error) {
//     // Handle duplicate email error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists'
//       });
//     }

//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// @desc Delete director
// @route DELETE /api/directors/:id
// @access Private (Admin only)
export const deleteDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({ success: false, message: 'Director not found' });
    }

    // Delete image from Cloudinary if exists
    if (director.photo) {
      const publicId = director.photo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`directors/${publicId}`);
    }

    await Director.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Director deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// export const deleteDirector = async (req, res) => {
//   try {
//     const director = await Director.findById(req.params.id);

//     if (!director) {
//       return res.status(404).json({
//         success: false,
//         message: 'Director not found'
//       });
//     }

//     await Director.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Director deleted successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// @desc Update director status
// @route PATCH /api/directors/:id/status
// @access Private (Admin only)
export const updateDirectorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const director = await Director.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    res.status(200).json({
      success: true,
      data: director
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update display order
// @route PATCH /api/directors/reorder
// @access Private (Admin only)
export const reorderDirectors = async (req, res) => {
  try {
    const { directors } = req.body; // Array of {id, displayOrder}

    const updatePromises = directors.map(({ id, displayOrder }) =>
      Director.findByIdAndUpdate(
        id,
        { displayOrder },
        { new: true, runValidators: true }
      )
    );

    await Promise.all(updatePromises);

    const updatedDirectors = await Director.find({ status: 'Active' })
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      data: updatedDirectors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
