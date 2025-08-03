import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    // Donor Information (from frontend form)
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    donorEmail: {
      type: String,
      required: [true, 'Donor email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    donorPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    
    // Address Information
    address: {
      type: String,
      required: [true, 'Address is required'],
      maxlength: 500,
      trim: true,
    },
    
    // ID Information (PAN/Aadhar)
    idType: {
      type: String,
      required: [true, 'ID Type is required'],
      enum: ['pan', 'aadhar'],
    },
    idNumber: {
      type: String,
      required: [true, 'ID Number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          if (this.idType === 'pan') {
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
          } else if (this.idType === 'aadhar') {
            return /^\d{12}$/.test(v);
          }
          return false;
        },
        message: 'Please enter a valid ID number'
      }
    },
    
    // Donation Amount
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [100, 'Minimum donation amount is ₹100'],
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR'],
    },
    
    // Terms Agreement
    agreeToTerms: {
      type: Boolean,
      required: [true, 'Must agree to terms and conditions'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'Must agree to terms and conditions'
      }
    },
    
    // Donation Type and Category
    donationType: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly'],
      default: 'one-time',
    },
    category: {
      type: String,
      enum: ['general', 'education', 'healthcare', 'infrastructure', 'emergency', 'other'],
      default: 'general',
    },
    
    // Razorpay Payment Integration
    razorpay: {
      orderId: {
        type: String,
        sparse: true, // Unique but allows null values
      },
      paymentId: {
        type: String,
        sparse: true,
      },
      signature: {
        type: String,
      },
    },
    
    // Payment Information
    paymentMethod: {
      type: String,
      enum: ['card', 'netbanking', 'wallet', 'upi', 'emi', 'paylater'],
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    paymentGateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'paytm', 'manual'],
      default: 'razorpay',
    },
    
    // Payment Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    paymentFailureReason: {
      type: String,
      trim: true,
    },
    
    // Receipt and Tax Information
    receiptUrl: {
      type: String, // URL to donation receipt PDF
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    taxDeductible: {
      type: Boolean,
      default: true,
    },
    section80GCertificate: {
      issued: {
        type: Boolean,
        default: false,
      },
      certificateUrl: String,
      issuedAt: Date,
    },
    
    // Additional Information
    message: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event', // If donation is for a specific event/campaign
    },
    
    // Admin Management
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adminNotes: {
      type: String,
      maxlength: 1000,
    },
    
    // Communication Tracking
    emailNotifications: {
      confirmationSent: {
        type: Boolean,
        default: false,
      },
      confirmationSentAt: Date,
      thankYouSent: {
        type: Boolean,
        default: false,
      },
      thankYouSentAt: Date,
      receiptSent: {
        type: Boolean,
        default: false,
      },
      receiptSentAt: Date,
    },
    
    // Recurring Donation Support
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDetails: {
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
      },
      nextDonationDate: Date,
      subscriptionId: String, // Razorpay subscription ID
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    
    // Analytics and Tracking
    source: {
      type: String,
      enum: ['website', 'mobile-app', 'social-media', 'event', 'referral', 'offline'],
      default: 'website',
    },
    ipAddress: String,
    userAgent: String,
    referrer: String,
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ donorEmail: 1, createdAt: -1 });
donationSchema.index({ donationType: 1, status: 1 });
donationSchema.index({ transactionId: 1 });

// Virtual for formatted amount
donationSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toLocaleString()}`;
});

// Pre-save middleware to generate receipt number
donationSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'completed' && !this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.receiptNumber = `RCP${year}${month}${day}${random}`;
  }
  next();
});

export default mongoose.model('Donation', donationSchema);
