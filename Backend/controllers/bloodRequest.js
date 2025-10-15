const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const { createNotification } = require('./notification');
const { findNearby } = require('../utils/distance');

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

        // Send in-app notifications to matching donors
        for (let donor of matchingDonors) {
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
        console.error('Get all blood requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blood requests',
            error: error.message
        });
    }
};

// Get nearby blood requests for donor
// ✅ FIXED: Get nearby requests
const getNearbyRequests = async (req, res) => {
    try {
      const userId = req.user.id;
      const { radius = 50 } = req.query;
  
      const donor = await Donor.findOne({ userId });
      
      if (!donor) {
        return res.status(400).json({
          success: false,
          message: 'Donor profile not found. Please complete your profile.'
        });
      }
  
      if (!donor.location || donor.location.coordinates[0] === 0) {
        // Return all pending requests as fallback
        const requests = await BloodRequest.find({
          status: 'pending',
          bloodGroup: donor.bloodgroup
        })
          .populate('createdBy', 'name phone email')
          .sort({ createdAt: -1 })
          .limit(20);
  
        return res.status(200).json({
          success: true,
          count: requests.length,
          data: requests,
          message: 'Location not set. Showing all matching requests.'
        });
      }
  
      // Use aggregation for geospatial query
      const nearbyRequests = await BloodRequest.aggregate([
        {
          $geoNear: {
            near: donor.location,
            distanceField: "distance",
            maxDistance: parseInt(radius) * 1000,
            spherical: true,
            query: {
              bloodGroup: donor.bloodgroup,
              status: 'pending'
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdByInfo'
          }
        },
        {
          $unwind: { path: '$createdByInfo', preserveNullAndEmptyArrays: true }
        },
        { $sort: { urgency: -1, distance: 1 } },
        { $limit: 50 }
      ]);
  
      res.status(200).json({
        success: true,
        count: nearbyRequests.length,
        data: nearbyRequests
      });
    } catch (error) {
      console.error('Get nearby requests error:', error);
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
            const recipient = await Recipient.findOne({ userId: updatedRequest.createdBy._id });
            if (recipient) {
                await Recipient.findByIdAndUpdate(recipient._id, {
                    $inc: { fulfilledRequests: 1 }
                });
            }
        }

        // Send notification to requester
        if (updatedRequest.createdBy && updatedRequest.createdBy._id) {
            await createNotification(updatedRequest.createdBy._id, {
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