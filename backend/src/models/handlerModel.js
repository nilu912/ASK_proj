import mongoose from 'mongoose';

const handlerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Handler name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['volunteer', 'coordinator', 'field-worker', 'supervisor', 'specialist', 'intern'],
      required: [true, 'Role is required'],
    },
    department: {
      type: String,
      enum: ['education', 'healthcare', 'social-work', 'fundraising', 'events', 'administration', 'marketing', 'finance', 'other'],
      required: [true, 'Department is required'],
    },
    expertise: [{
      type: String,
      trim: true,
    }],
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number, // in years
      min: 0,
      default: 0,
    },
    availability: {
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      }],
      timeSlots: [{
        start: String, // e.g., "09:00"
        end: String,   // e.g., "17:00"
      }],
      hours: {
        type: Number, // hours per week
        min: 0,
        max: 168,
      },
    },
    contact: {
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'India' },
      },
      emergencyContact: {
        name: String,
        phone: String,
        relationship: String,
      },
      whatsapp: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave', 'terminated', 'pending-approval'],
      default: 'pending-approval',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    photo: {
      type: String, // Cloudinary URL
    },
    documents: [{
      name: String,
      url: String, // Cloudinary URL
      type: {
        type: String,
        enum: ['id-proof', 'address-proof', 'education-certificate', 'experience-letter', 'background-check', 'other'],
      },
      verified: {
        type: Boolean,
        default: false,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      verifiedAt: Date,
    }],
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      },
      certified: {
        type: Boolean,
        default: false,
      },
    }],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native'],
      },
    }],
    assignments: [{
      title: String,
      description: String,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
        default: 'assigned',
      },
      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    }],
    performance: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: [{
        message: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        givenBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      }],
      totalHours: {
        type: Number,
        default: 0,
      },
      completedTasks: {
        type: Number,
        default: 0,
      },
    },
    background: {
      education: [{
        degree: String,
        institution: String,
        year: Number,
      }],
      workExperience: [{
        company: String,
        position: String,
        duration: String,
        description: String,
      }],
      motivation: {
        type: String,
        maxlength: 500,
      },
    },
    preferences: {
      communicationMethod: {
        type: String,
        enum: ['email', 'phone', 'whatsapp', 'in-person'],
        default: 'email',
      },
      workType: [{
        type: String,
        enum: ['field-work', 'office-work', 'remote', 'events', 'training'],
      }],
      travelWillingness: {
        local: { type: Boolean, default: true },
        outstation: { type: Boolean, default: false },
        international: { type: Boolean, default: false },
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
handlerSchema.index({ status: 1, role: 1 });
handlerSchema.index({ department: 1, status: 1 });
handlerSchema.index({ email: 1 });
handlerSchema.index({ expertise: 1 });
handlerSchema.index({ 'availability.days': 1 });

// Virtual for full name display
handlerSchema.virtual('displayName').get(function() {
  return `${this.name} (${this.role})`;
});

// Virtual for active assignments count
handlerSchema.virtual('activeAssignmentsCount').get(function() {
  return this.assignments.filter(assignment => 
    assignment.status === 'assigned' || assignment.status === 'in-progress'
  ).length;
});

// Virtual for years of experience
handlerSchema.virtual('yearsWithOrganization').get(function() {
  const diffTime = Math.abs(Date.now() - this.joinDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
});

// Pre-save middleware to update last active
handlerSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'active') {
    this.lastActive = new Date();
  }
  next();
});

export default mongoose.model('Handler', handlerSchema);
