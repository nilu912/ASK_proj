import mongoose, { Document, Schema } from 'mongoose';

// Gallery item types
export type MediaType = 'image' | 'video';
export type CategoryType = 'events' | 'activities' | 'success' | 'facilities';

// Gallery interface
export interface IGallery extends Document {
  title: string;
  description?: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  category: CategoryType;
  tags?: string[];
  event?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Gallery schema
const gallerySchema = new Schema<IGallery>(
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
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Media type is required'],
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ['events', 'activities', 'success', 'facilities'],
      required: [true, 'Category is required'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export Gallery model
const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);
export default Gallery;