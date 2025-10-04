const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');

// Create blood request
const createBloodRequest = async (req, res) => {
    try {
        const newRequest = new BloodRequest(req.body);
        const savedRequest = await newRequest.save();

        // Find matching donors
        const matchingDonors = await Donor.find({
            bloodgroup: req.body.bloodGroup
        });

        // Send notification emails to matching donors
        for (let donor of matchingDonors) {
            const messageOptions = {
                from: process.env.EMAIL_USER,
                to: donor.email,
                subject: 'Urgent Blood Donation Request',
                html: `
                    <h2>Blood Donation Needed</h2>
                    <p>Dear ${donor.name},</p>
                    <p>We have an urgent request for ${req.body.bloodGroup} blood.</p>
                    <p><strong>Patient:</strong> ${req.body.patientName}</p>
                    <p><strong>Hospital:</strong> ${req.body.hospitalName}</p>
                    <p><strong>Contact:</strong> ${req.body.contactNumber}</p>
                    <p>If you can help, please contact us immediately.</p>
                `
            };

            try {
                await sendMail(messageOptions);
            } catch (error) {
                console.error('Failed to send email:', error);
            }
        }

        res.status(201).json({
            success: true,
            data: savedRequest,
            message: 'Blood request created and notifications sent'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create blood request',
            error: error.message
        });
    }
};

// Get all blood requests
const getAllBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blood requests',
            error: error.message
        });
    }
};

// Update blood request status
const updateBloodRequestStatus = async (req, res) => {
    try {
        const updatedRequest = await BloodRequest.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: 'Blood request updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update blood request',
            error: error.message
        });
    }
};

// Delete blood request
const deleteBloodRequest = async (req, res) => {
    try {
        await BloodRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Blood request deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete blood request',
            error: error.message
        });
    }
};

module.exports = {
    createBloodRequest,
    getAllBloodRequests,
    updateBloodRequestStatus,
    deleteBloodRequest
};