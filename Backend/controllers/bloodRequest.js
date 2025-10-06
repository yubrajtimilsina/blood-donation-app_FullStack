const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const { createNotification } = require('./notification');
const { findNearby } = require('../utils/distance');
const sendMail = require('../../BackgroundServices/helpers/sendmail');

// Create blood request
const createBloodRequest = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        // Get recipient profile to add location data
        let recipientProfile;
        if (userId) {
            recipientProfile = await Recipient.findOne({ userId });
        }

        const requestData = {
            ...req.body,
            createdBy: userId,
            location: recipientProfile?.location || { type: 'Point', coordinates: [0, 0] }
        };

        const newRequest = new BloodRequest(requestData);
        const savedRequest = await newRequest.save();

        // Update recipient's total requests
        if (recipientProfile) {
            await Recipient.findByIdAndUpdate(recipientProfile._id, {
                $inc: { totalRequests: 1 }
            });
        }

        // Find nearby available donors with matching blood group
        let matchingDonors = [];
        
        if (recipientProfile && recipientProfile.location.coordinates[0] !== 0) {
            matchingDonors = await findNearby(
                Donor,
                recipientProfile.location.coordinates,
                50, // 50km radius
                {
                    bloodgroup: req.body.bloodGroup,
                    isAvailable: true
                }
            );
        } else {
            // If no location, find all matching donors
            matchingDonors = await Donor.find({
                bloodgroup: req.body.bloodGroup,
                isAvailable: true
            }).limit(20);
        }

        // Send notification emails to matching donors
        for (let donor of matchingDonors) {
            // Create in-app notification
            if (donor.userId) {
                await createNotification(donor.userId, {
                    type: 'blood_request',
                    title: 'New Blood Request Nearby',
                    message: `Urgent ${req.body.bloodGroup} blood needed at ${req.body.hospitalName}`,
                    priority: req.body.urgency === 'critical' ? 'urgent' : 'high',
                    relatedId: savedRequest._id,
                    relatedModel: 'BloodRequest',
                    actionUrl: `/blood-requests/${savedRequest._id}`
                });
            }

            // Send email notification
            const messageOptions = {
                from: process.env.EMAIL_USER,
                to: donor.email,
                subject: `Urgent: ${req.body.bloodGroup} Blood Donation Needed`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #EF4444;">🩸 Urgent Blood Donation Request</h2>
                        <p>Dear ${donor.name},</p>
                        <p>We have an urgent request for <strong>${req.body.bloodGroup}</strong> blood donation.</p>
                        
                        <div style="background: #FEE2E2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #DC2626;">Request Details:</h3>
                            <p><strong>Patient:</strong> ${req.body.patientName}</p>
                            <p><strong>Hospital:</strong> ${req.body.hospitalName}</p>
                            <p><strong>Units Needed:</strong> ${req.body.unitsNeeded}</p>
                            <p><strong>Urgency:</strong> ${req.body.urgency.toUpperCase()}</p>
                            <p><strong>Required By:</strong> ${new Date(req.body.requiredBy).toLocaleDateString()}</p>
                            <p><strong>Contact:</strong> ${req.body.contactNumber}</p>
                            <p><strong>Address:</strong> ${req.body.address}</p>
                        </div>
                        
                        ${req.body.description ? `<p><strong>Additional Info:</strong> ${req.body.description}</p>` : ''}
                        
                        <p style="color: #DC2626; font-weight: bold;">Your donation can save a life!</p>
                        
                        <p>If you can help, please contact the hospital immediately at ${req.body.contactNumber}</p>
                        
                        <div style="background: #F3F4F6; padding: 10px; border-radius: 5px; margin-top: 20px;">
                            <p style="margin: 0; font-size: 12px; color: #6B7280;">
                                This is an automated message from LifeLink Blood Donation System.
                            </p>
                        </div>
                    </div>
                `
            };

            try {
                await sendMail(messageOptions);
            } catch (error) {
                console.error('Failed to send email to donor:', donor.email, error);
            }
        }

        res.status(201).json({
            success: true,
            data: savedRequest,
            notifiedDonors: matchingDonors.length,
            message: `Blood request created and ${matchingDonors.length} matching donors notified`
        });
    } catch (error) {
        console.error('Create blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create blood request',
            error: error.message
        });
    }
};

// Get all blood requests with filters
const getAllBloodRequests = async (req, res) => {
    try {
        const { status, bloodGroup, urgency, userId } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (urgency) filter.urgency = urgency;
        if (userId) filter.createdBy = userId;

        const requests = await BloodRequest.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
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

// Get nearby blood requests for donor
const getNearbyRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const { radius = 50 } = req.query; // default 50km

        // Get donor profile with location
        const donor = await Donor.findOne({ userId });
        
        if (!donor || !donor.location || donor.location.coordinates[0] === 0) {
            return res.status(400).json({
                success: false,
                message: 'Donor location not set. Please update your profile.'
            });
        }

        // Find nearby blood requests matching donor's blood group
        const nearbyRequests = await findNearby(
            BloodRequest,
            donor.location.coordinates,
            parseInt(radius),
            {
                bloodGroup: donor.bloodgroup,
                status: 'pending'
            }
        );

        res.status(200).json({
            success: true,
            count: nearbyRequests.length,
            data: nearbyRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch nearby requests',
            error: error.message
        });
    }
};

// Get single blood request
const getBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const request = await BloodRequest.findById(id)
            .populate('createdBy', 'name email phone');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blood request',
            error: error.message
        });
    }
};

// Update blood request status
const updateBloodRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, fulfilledBy } = req.body;

        const updatedRequest = await BloodRequest.findByIdAndUpdate(
            id,
            { 
                status,
                fulfilledBy,
                fulfilledAt: status === 'fulfilled' ? new Date() : undefined
            },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Update recipient's fulfilled count
        if (status === 'fulfilled' && updatedRequest.createdBy) {
            const recipient = await Recipient.findOne({ userId: updatedRequest.createdBy });
            if (recipient) {
                await Recipient.findByIdAndUpdate(recipient._id, {
                    $inc: { fulfilledRequests: 1 }
                });
            }
        }

        // Send notification to requester
        if (updatedRequest.createdBy) {
            await createNotification(updatedRequest.createdBy, {
                type: 'request_fulfilled',
                title: 'Blood Request Updated',
                message: `Your blood request has been marked as ${status}`,
                priority: 'high',
                relatedId: updatedRequest._id,
                relatedModel: 'BloodRequest'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: 'Blood request updated successfully'
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
        const { id } = req.params;
        
        const request = await BloodRequest.findByIdAndDelete(id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blood request deleted successfully'
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
    getNearbyRequests,
    getBloodRequest,
    updateBloodRequestStatus,
    deleteBloodRequest
};