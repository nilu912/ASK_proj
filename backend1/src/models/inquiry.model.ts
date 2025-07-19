import mongoose, { Document, Schema } from 'mongoose';

// Inquiry status types
export type InquiryStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

// Inquiry interface
export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
  status: InquiryStatus;
  inquiryId: string;
  assignedTo?: mongoose.Types.ObjectId;
  response?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Inquiry schema
const inquirySchema = new Schema<IInquiry>(
  {
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
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    attachmentUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'closed'],
      default: 'new',
    },
    inquiryId: {
      type: String,
      required: true,
      unique: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    response: {
      type: String,
    },
    responseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique inquiry ID before saving
inquirySchema.pre('save', async function (next) {
  if (!this.inquiryId) {
    // Generate inquiry ID: INQ-{YYYYMMDD}-{Random 6 digits}
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    this.inquiryId = `INQ-${dateStr}-${randomNum}`;
  }
  next();
});

// Create and export Inquiry model
const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);
export default Inquiry;