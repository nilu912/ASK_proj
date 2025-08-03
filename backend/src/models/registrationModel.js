import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: [true, 'Form data is required'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    // Store user contact info separately for easy access
    contactInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
registrationSchema.index({ event: 1, submittedAt: -1 });
registrationSchema.index({ status: 1 });

// Virtual to get formatted submission date
registrationSchema.virtual('formattedDate').get(function() {
  return this.submittedAt.toLocaleDateString();
});

export default mongoose.model('Registration', registrationSchema);
