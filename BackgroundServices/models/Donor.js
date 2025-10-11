const mongoose = require('mongoose');

const DonorSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: {
    type: Date
  },
  tel: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  bloodgroup: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  weight: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  diseases: {
    type: String,
  },
  bloodpressure: {
    type: Number
  },
  // NEW FIELDS
  isAvailable: {
    type: Boolean,
    default: true
  },
  lastDonationDate: {
    type: Date
  },
  nextEligibleDate: {
    type: Date
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  preferredDonationCenter: {
    type: String
  },
  donationRadius: {
    type: Number, // in kilometers
    default: 10
  },
  status: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for geospatial queries
DonorSchema.index({ location: '2dsphere' });

// Calculate next eligible date when last donation date is set
DonorSchema.pre('save', function(next) {
  if (this.lastDonationDate) {
    const nextDate = new Date(this.lastDonationDate);
    nextDate.setDate(nextDate.getDate() + 90);
    this.nextEligibleDate = nextDate;

    // Auto set availability based on eligibility
    const today = new Date();
    this.isAvailable = today >= nextDate;
  }
  next();
});

const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;
