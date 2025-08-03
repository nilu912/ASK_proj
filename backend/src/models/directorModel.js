import mongoose from 'mongoose';

const directorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    photo: {
      type: String, // Cloudinary URL
      default: null,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      youtube: String,
      instagram: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
directorSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Director', directorSchema);
