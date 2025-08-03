import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    mediaUrl: {
      type: String,
      required: true, // Cloudinary URL
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String, // Only for videos
    },
    caption: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
    metadata: {
      size: Number,       // bytes
      width: Number,
      height: Number,
      duration: Number,   // for videos
      format: String,
    }
  },
  { _id: false }
);

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    poster: {
      url: {
        type: String,
        required: true, // Cloudinary image URL
      },
      publicId: {
        type: String,
        required: true, // Required for deletion
      }
    },
    category: {
      type: String,
      enum: ['events', 'activities', 'testimonials', 'success', 'facilities', 'other'],
      default: 'other',
    },
    media: [mediaSchema], // Embedded media array
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model('Gallery', gallerySchema);
