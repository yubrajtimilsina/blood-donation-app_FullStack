const mongoose = require('mongoose');

const BloodRequestSchema = mongoose.Schema({
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
    requiredBy: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);