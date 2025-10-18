// Backend/models/Chat.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'donor', 'recipient', 'hospital'],
      required: true
    }
  }],
  messages: [MessageSchema],
  lastMessage: {
    content: String,
    timestamp: Date,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['blood_request', 'donation', 'general']
    },
    id: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

// Index for faster queries
ChatSchema.index({ 'participants.userId': 1 });
ChatSchema.index({ 'lastMessage.timestamp': -1 });

module.exports = mongoose.model('Chat', ChatSchema);