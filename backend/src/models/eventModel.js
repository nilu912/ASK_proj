import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    address: {
      type: String,
      require: true,
      default: 'India'
    },
    images: [
      {
        url: String,
        public_id: String
      }
    ],
        status: {
      type: String,
      enum: ['Published', 'Cancelled', 'Completed', 'Upcoming'],
      default: 'Upcoming',
    },
    registrationRequired: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
    },
    registrationFields: [
      {
        id: String,
        label: String,
        type: String,
        required: Boolean,
        options: [String],
        placeholder: String
      }
    ],
    maxParticipants: {
      type: Number,
      default: null, // null means unlimited
    },
    currentParticipants: {
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

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  const registrationDeadline = this.registrationDeadline || this.startDate;
  return this.registrationRequired && 
         this.status === 'Published' && 
         now < registrationDeadline &&
         (this.maxParticipants === null || this.currentParticipants < this.maxParticipants);
});

// Index for better query performance
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ featured: 1, startDate: 1 });

export default mongoose.model('Event', eventSchema);
