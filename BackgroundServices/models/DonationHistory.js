const mongoose = require('mongoose');

const DonationHistorySchema = mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  donationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  bloodGroup: {
    type: String,
    required: true
  },
  unitsGiven: {
    type: Number,
    default: 1
  },
  location: {
    hospitalName: String,
    address: String
  },
  recipientName: String,
  status: {
    type: String,
    enum: ['completed', 'scheduled', 'cancelled'],
    default: 'completed'
  },
  notes: String,
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: String,
  nextEligibleDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate next eligible date (90 days after donation)
DonationHistorySchema.pre('save', function(next) {
  if (this.isNew && this.status === 'completed') {
    const nextDate = new Date(this.donationDate);
    nextDate.setDate(nextDate.getDate() + 90);
    this.nextEligibleDate = nextDate;
  }
  next();
});

module.exports = mongoose.model('DonationHistory', DonationHistorySchema);