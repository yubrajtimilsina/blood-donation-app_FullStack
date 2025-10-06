const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'donor', 'recipient'],
    default: 'donor'
  },
  profileImage: {
    type: String,
    default: ''
  },
  phone: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  // Reference to role-specific profile
  donorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  },
  recipientProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;