import mongoose, { Document, Schema } from 'mongoose';

// Event Registration interface
export interface IEventRegistration extends Document {
  event: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dob?: Date;
  gender?: 'male' | 'female' | 'other';
  idType?: 'pan' | 'aadhar';
  idNumber?: string;
  notes?: string;
  registrationId: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentAmount?: number;
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event Registration schema
const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    idType: {
      type: String,
      enum: ['pan', 'aadhar'],
    },
    idNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentAmount: {
      type: Number,
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
    },
    paymentReference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique registration ID before saving
eventRegistrationSchema.pre('save', async function (next) {
  if (!this.registrationId) {
    // Generate registration ID: REG-{YYYYMMDD}-{Random 6 digits}
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    this.registrationId = `REG-${dateStr}-${randomNum}`;
  }
  next();
});

// Create and export EventRegistration model
const EventRegistration = mongoose.model<IEventRegistration>('EventRegistration', eventRegistrationSchema);
export default EventRegistration;