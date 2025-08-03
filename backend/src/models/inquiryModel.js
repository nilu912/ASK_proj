import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['general', 'volunteering', 'donation', 'event', 'complaint', 'suggestion', 'partnership', 'media', 'other'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'closed', 'spam'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['website', 'email', 'phone', 'social-media', 'walk-in', 'event', 'referral'],
      default: 'website',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    responses: [{
      message: {
        type: String,
        required: true,
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      respondedAt: {
        type: Date,
        default: Date.now,
      },
      responseType: {
        type: String,
        enum: ['email', 'phone', 'in-person', 'internal-note'],
        default: 'email',
      },
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    attachments: [{
      filename: String,
      url: String, // Cloudinary URL
      fileType: String,
      fileSize: Number,
    }],
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedbackMessage: {
      type: String,
      maxlength: 500,
    },
    isSubscribeNewsletter: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },
    organization: {
      type: String,
      trim: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'email',
    },
    preferredContactTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime',
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    firstResponseTime: {
      type: Date,
    },
    totalResponseTime: {
      type: Number, // in minutes
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ category: 1, status: 1 });
inquirySchema.index({ assignedTo: 1, status: 1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ priority: 1, status: 1 });

// Virtual for response count
inquirySchema.virtual('responseCount').get(function() {
  return this.responses.length;
});

// Virtual for days since creation
inquirySchema.virtual('daysSinceCreated').get(function() {
  const diffTime = Math.abs(Date.now() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update resolved status and time
inquirySchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'resolved' || this.status === 'closed') {
      this.resolved = true;
      if (!this.resolvedAt) {
        this.resolvedAt = new Date();
      }
    } else {
      this.resolved = false;
      this.resolvedAt = null;
    }
  }
  
  // Set first response time
  if (this.responses.length > 0 && !this.firstResponseTime) {
    this.firstResponseTime = this.responses[0].respondedAt;
  }
  
  next();
});

export default mongoose.model('Inquiry', inquirySchema);
