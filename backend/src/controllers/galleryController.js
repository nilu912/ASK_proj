import Gallery from '../models/galleryModel.js';
import { streamUpload } from '../utils/cloudinaryUpload.js'; // adjust path if needed;
import cloudinary from 'cloudinary';


// @desc Get all gallery items
// @route GET /api/gallery
// @access Public
export const getGalleryItems = async (req, res) => {
  try {
    const { category, limit, sort } = req.query;

    // Construct dynamic query
    const query = {};
    if (category) query.category = category;

    // Handle sort: 'date' or 'custom'
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'custom') {
      sortOption = { displayOrder: 1, createdAt: -1 }; // if using displayOrder
    }

    // Fetch from DB
    const galleryItems = await Gallery.find(query)
      .sort(sortOption)
      .limit(limit ? parseInt(limit) : 0); // limit=0 means no limit

    return res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
    });

  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch gallery items.',
    });
  }
};

// @desc Get single gallery item
// @route GET /api/gallery/:id
// @access Public
export const getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('uploadedBy', 'name');

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Increment views
    galleryItem.views += 1;
    await galleryItem.save();

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Create new gallery item
// @route POST /api/gallery
// @access Private (Admin only)
// controllers/galleryController.js
export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const { poster, media } = req.files;

    if (!poster?.length || !media?.length) {
      return res.status(400).json({ success: false, message: 'Poster and media files are required.' });
    }

    // Upload the poster image
    const posterUpload = await streamUpload(poster[0].buffer);

    // Upload media files (images/videos)
    const uploadedMedia = await Promise.all(
      media.map(async (file) => {
        const result = await streamUpload(file.buffer);

        return {
          mediaUrl: result.secure_url,
          mediaType: result.resource_type === 'video' ? 'video' : 'image',
          thumbnailUrl: result.resource_type === 'video' ? result.thumbnail_url || null : null,
          publicId: result.public_id,
          metadata: {
            size: result.bytes,
            width: result.width,
            height: result.height,
            duration: result.duration || null,
            format: result.format,
          },
        };
      })
    );

    // Create and save gallery item
    const galleryItem = await Gallery.create({
      title,
      description,
      category,
      poster: {url: posterUpload.secure_url, publicId: posterUpload.public_id}, // just the URL
      media: uploadedMedia,
    });

    res.status(201).json({ success: true, data: galleryItem });
  } catch (error) {
    console.error('Gallery creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc Update gallery item
// @route PUT /api/gallery/:id
// @access Private (Admin only)
export const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Delete gallery item
// @route DELETE /api/gallery/:id
// @access Private (Admin only)
export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update gallery item status
// @route PATCH /api/gallery/:id/status
// @access Private (Admin only)
export const updateGalleryItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Like gallery item
// @route POST /api/gallery/:id/like
// @access Public
export const likeGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    galleryItem.likes += 1;
    await galleryItem.save();

    res.status(200).json({
      success: true,
      data: {
        likes: galleryItem.likes
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get featured gallery items
// @route GET /api/gallery/featured
// @access Public
export const getFeaturedGalleryItems = async (req, res) => {
  try {
    const { limit } = req.query;

    const galleryItems = await Gallery.find({ 
      featured: true, 
      status: 'published' 
    })
      .populate('uploadedBy', 'name')
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 10);

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const addMediaToGalleryItem = async (req, res) => {
  try {
    const { limit } = req.query;

    const galleryItems = await Gallery.find({ 
      featured: true, 
      status: 'published' 
    })
      .populate('uploadedBy', 'name')
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 10);

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// Ensure cloudinary is configured somewhere in your project
// e.g., in a config/cloudinary.js file and imported here
export const deleteCategoryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    // 1. Delete poster image from Cloudinary
    if (galleryItem.poster?.publicId) {
      const res = await cloudinary.v2.uploader.destroy(galleryItem.poster.publicId);
      console.log(res)
    }

    // 2. Delete each media file from Cloudinary
    const deleteMediaPromises = galleryItem.media.map((mediaItem) => {
      if (mediaItem.publicId) {
        return cloudinary.v2.uploader.destroy(mediaItem.publicId, {
          resource_type: mediaItem.mediaType === 'video' ? 'video' : 'image',
        });
      }
    });

    await Promise.all(deleteMediaPromises);

    // 3. Delete the gallery item from MongoDB
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gallery item and media deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gallery item',
    });
  }
};
