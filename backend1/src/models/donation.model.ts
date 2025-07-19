import mongoose, { Document, Schema } from 'mongoose';

// Donation status types
export type DonationStatus = 'pending' | 'completed' | 'failed';

// Donation interface
export interface IDonation extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  idType: 'pan' | 'aadhar';
  idNumber: string;
  amount: number;
  donationId: string;
  paymentStatus: DonationStatus;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: Date;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Donation schema
const donationSchema = new Schema<IDonation>(
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
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    idType: {
      type: String,
      enum: ['pan', 'aadhar'],
      required: [true, 'ID type is required'],
    },
    idNumber: {
      type: String,
      required: [true, 'ID number is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    donationId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
    },
    paymentReference: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    receiptUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique donation ID before saving
donationSchema.pre('save', async function (next) {
  if (!this.donationId) {
    // Generate donation ID: DON-{YYYYMMDD}-{Random 6 digits}
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    this.donationId = `DON-${dateStr}-${randomNum}`;
  }
  next();
});

// Create and export Donation model
const Donation = mongoose.model<IDonation>('Donation', donationSchema);
export default Donation;