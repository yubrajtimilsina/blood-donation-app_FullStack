const mongoose = require('mongoose');

const RecipientSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: {
        type: Date
    },
    phone: {
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
      emergencyContact: {
        name: String,
        phone: String
      },
      verified: {
        type: Boolean,
        default: false
      },
      totalRequests: {
        type: Number,
        default: 0
      },
      fulfilledRequests: {
        type: Number,
        default: 0
      }
    }, {
      timestamps: true
    });

RecipientSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Recipient', RecipientSchema);