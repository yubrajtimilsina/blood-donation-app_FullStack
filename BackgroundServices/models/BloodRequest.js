const mongoose = require('mongoose');

const BloodRequestSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    patientName: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    unitsNeeded: {
        type: Number,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
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
    requiredBy: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    fulfilledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor'
    },
    fulfilledAt: {
        type: Date
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

// Index for geospatial queries
BloodRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
