const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const { createNotification, createBulkNotifications } = require('./notification');
const { findNearby } = require('../utils/distance');

// ✅ ENHANCED: Create blood request with real-time notifications
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

        // ✅ BULK NOTIFICATIONS: Send in-app notifications to matching donors
        const donorUserIds = matchingDonors
            .map(donor => donor.userId)
            .filter(id => id); // Filter out null/undefined

        if (donorUserIds.length > 0) {
            await createBulkNotifications(donorUserIds, {
                type: 'blood_request',
                title: 'New Blood Request Nearby',
                message: `Urgent ${req.body.bloodGroup} blood needed at ${req.body.hospitalName}`,
                priority: req.body.urgency === 'critical' ? 'urgent' : 'high',
                relatedId: savedRequest._id,
                relatedModel: 'BloodRequest',
                actionUrl: `/blood-requests/${savedRequest._id}`
            });
        }

        // ✅ EMIT SOCKET EVENT: Broadcast to all matching donors
        if (global.io) {
            donorUserIds.forEach(donorUserId => {
                global.io.to(`user-${donorUserId}`).emit('newBloodRequest', {
                    request: savedRequest,
                    bloodGroup: req.body.bloodGroup,
                    urgency: req.body.urgency,
                    hospitalName: req.body.hospitalName,
                    timestamp: new Date()
                });
            });
            
            // Also broadcast to all donors' role-based room
            global.io.emit('bloodRequestCreated', {
                requestId: savedRequest._id,
                bloodGroup: req.body.bloodGroup,
                urgency: req.body.urgency,
                unitsNeeded: req.body.unitsNeeded,
                hospitalName: req.body.hospitalName,
                requiredBy: req.body.requiredBy
            });
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
            .populate('createdBy', 'name email phone')
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
            .populate('createdBy', 'name email phone')
            .populate('fulfilledBy', 'name bloodgroup');

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

// ✅ ENHANCED: Update blood request status with notifications
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
        ).populate('createdBy', 'name email')
         .populate('fulfilledBy', 'name bloodgroup email tel');

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

        // ✅ NOTIFICATIONS: Send to requester
        if (updatedRequest.createdBy && updatedRequest.createdBy._id) {
            const notificationMessage = status === 'fulfilled' 
                ? `Your blood request has been fulfilled by ${updatedRequest.fulfilledBy?.name || 'a donor'}`
                : `Your blood request has been marked as ${status}`;

            await createNotification(updatedRequest.createdBy._id, {
                type: 'request_fulfilled',
                title: 'Blood Request Updated',
                message: notificationMessage,
                priority: 'high',
                relatedId: updatedRequest._id,
                relatedModel: 'BloodRequest'
            });
        }

        // ✅ SOCKET EVENT: Notify requester in real-time
        if (global.io && updatedRequest.createdBy) {
            global.io.to(`user-${updatedRequest.createdBy._id}`).emit('requestStatusChanged', {
                requestId: updatedRequest._id,
                status,
                fulfilledBy: updatedRequest.fulfilledBy,
                timestamp: new Date()
            });
        }

        // ✅ If fulfilled, notify the donor as well
        if (status === 'fulfilled' && fulfilledBy) {
            const donor = await Donor.findById(fulfilledBy);
            if (donor && donor.userId) {
                await createNotification(donor.userId, {
                    type: 'donation_reminder',
                    title: 'Donation Confirmed',
                    message: `Thank you for fulfilling the blood request for ${updatedRequest.patientName}`,
                    priority: 'medium',
                    relatedId: updatedRequest._id,
                    relatedModel: 'BloodRequest'
                });

                // Socket notification to donor
                if (global.io) {
                    global.io.to(`user-${donor.userId}`).emit('donationConfirmed', {
                        requestId: updatedRequest._id,
                        patientName: updatedRequest.patientName,
                        hospitalName: updatedRequest.hospitalName,
                        timestamp: new Date()
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: 'Blood request updated successfully'
        });
    } catch (error) {
        console.error('Update blood request error:', error);
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

        // ✅ SOCKET EVENT: Broadcast deletion
        if (global.io) {
            global.io.emit('requestDeleted', {
                requestId: id,
                timestamp: new Date()
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

// ✅ NEW: Accept blood request (donor accepts)
const acceptBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const donorUserId = req.user.id;

        const donor = await Donor.findOne({ userId: donorUserId });
        
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            });
        }

        const request = await BloodRequest.findById(id)
            .populate('createdBy', 'name email phone');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request is no longer pending'
            });
        }

        // Update request
        request.status = 'fulfilled';
        request.fulfilledBy = donor._id;
        request.fulfilledAt = new Date();
        await request.save();

        // Notify recipient
        if (request.createdBy) {
            await createNotification(request.createdBy._id, {
                type: 'request_fulfilled',
                title: 'Donor Found!',
                message: `${donor.name} has accepted your blood request`,
                priority: 'urgent',
                relatedId: request._id,
                relatedModel: 'BloodRequest'
            });

            // Socket notification
            if (global.io) {
                global.io.to(`user-${request.createdBy._id}`).emit('donorAccepted', {
                    requestId: request._id,
                    donor: {
                        name: donor.name,
                        bloodgroup: donor.bloodgroup,
                        tel: donor.tel
                    },
                    timestamp: new Date()
                });
            }
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Blood request accepted successfully'
        });
    } catch (error) {
        console.error('Accept blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept blood request',
            error: error.message
        });
    }
};

// Add this new controller method

// Donor responds to a blood request
const respondToBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { donorId, donorName, donorPhone, donorEmail, bloodGroup, unitsOffered } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      id,
      {
        $push: {
          responses: {
            donorId,
            donorName,
            donorPhone,
            donorEmail,
            bloodGroup,
            unitsOffered,
            status: 'pending',
            respondedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    // Create notification for hospital
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: request.createdBy,
      type: 'blood_request',
      title: 'New Donor Response',
      message: `${donorName} has responded to your ${bloodGroup} blood request with ${unitsOffered} units`,
      relatedId: request._id,
      relatedModel: 'BloodRequest',
      priority: request.urgency === 'critical' ? 'urgent' : 'high',
      actionUrl: `/blood-request/${request._id}`
    });

    // Emit socket event
    if (global.io) {
      global.io.to(`hospital-${request.createdBy}`).emit('donorResponded', {
        requestId: request._id,
        donorName,
        donorPhone,
        bloodGroup,
        unitsOffered
      });
    }

    res.status(200).json({
      success: true,
      data: request,
      message: 'Donor response recorded successfully'
    });
  } catch (error) {
    console.error('Error responding to blood request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record donor response',
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
  deleteBloodRequest,
  acceptBloodRequest,
  respondToBloodRequest
};
