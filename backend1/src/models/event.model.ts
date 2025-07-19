import mongoose, { Document, Schema } from 'mongoose';

// Event interface
export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  registrationFee?: number;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  maxParticipants?: number;
  registeredParticipants?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Event schema
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    image: {
      type: String,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String,
    },
    contactEmail: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    contactPhone: {
      type: String,
    },
    maxParticipants: {
      type: Number,
    },
    registeredParticipants: {
      type: Number,
      default: 0,
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

// Create and export Event model
const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;