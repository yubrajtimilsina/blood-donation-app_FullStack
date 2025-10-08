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
  bloodGroup: {
    type: String,
    required: true
  },
  unitsGiven: {
    type: Number,
    default: 1
  },
  location: {
    type: String
  },
  recipientName: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  },
  donationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const DonationHistory = mongoose.model('DonationHistory', DonationHistorySchema);

module.exports = DonationHistory;