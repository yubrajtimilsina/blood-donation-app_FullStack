 const User = require('../models/User');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const DonationHistory = require('../models/DonationHistory');
const Hospital = require('../models/Hospital');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalRecipients,
      activeRequests,
      totalDonations,
      todayRequests
    ] = await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      Recipient.countDocuments(),
      BloodRequest.countDocuments({ status: 'pending' }),
      DonationHistory.countDocuments({ status: 'completed' }),
      BloodRequest.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      })
    ]);

    // Blood group distribution
    const bloodGroupStats = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodgroup',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activities
    const recentDonations = await DonationHistory.find({ status: 'completed' })
      .populate('donorId', 'name bloodgroup')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDonors,
          totalRecipients,
          activeRequests,
          totalDonations,
          todayRequests
        },
        bloodGroupStats,
        recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// Get all users with filters
const getAllUsers = async (req, res) => {
  try {
    const { role, verified, search, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('donorProfile')
      .populate('recipientProfile')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Don't allow password updates through this route
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated profiles
    if (user.donorProfile) {
      await Donor.findByIdAndDelete(user.donorProfile);
    }
    if (user.recipientProfile) {
      await Recipient.findByIdAndDelete(user.recipientProfile);
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Verify user
const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification
    await Notification.create({
      userId,
      type: 'system',
      title: 'Account Verified',
      message: 'Your account has been verified by the administrator',
      priority: 'medium'
    });

    res.status(200).json({
      success: true,
      data: user,
      message: 'User verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify user',
      error: error.message
    });
  }
};

// Get system analytics
const getSystemAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const [
      userGrowth,
      donationTrends,
      requestTrends,
      successRate
    ] = await Promise.all([
      User.aggregate([
        { $match: dateFilter.createdAt ? { createdAt: dateFilter } : {} },
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      DonationHistory.aggregate([
        { $match: dateFilter.donationDate ? { donationDate: dateFilter } : {} },
        {
          $group: {
            _id: { 
              year: { $year: '$donationDate' },
              month: { $month: '$donationDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      BloodRequest.aggregate([
        { $match: dateFilter.createdAt ? { createdAt: dateFilter } : {} },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      BloodRequest.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            fulfilled: {
              $sum: { $cond: [{ $eq: ['$status', 'fulfilled'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        donationTrends,
        requestTrends,
        successRate: successRate[0] ? 
          (successRate[0].fulfilled / successRate[0].total * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};


// Blood inventory status across hospitals
const getBloodInventoryStatus = async (req, res) => {
  try {
    const inventories = await Hospital.aggregate([
      {
        $project: {
          name: 1,
          'A+': '$bloodInventory.A+',
          'A-': '$bloodInventory.A-',
          'B+': '$bloodInventory.B+',
          'B-': '$bloodInventory.B-',
          'AB+': '$bloodInventory.AB+',
          'AB-': '$bloodInventory.AB-',
          'O+': '$bloodInventory.O+',
          'O-': '$bloodInventory.O-'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: inventories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory status',
      error: error.message
    });
  }
};

// Donor statistics by location
const getDonorsByLocation = async (req, res) => {
  try {
    const stats = await Donor.aggregate([
      {
        $group: {
          _id: '$address',
          totalDonors: { $sum: 1 },
          availableDonors: {
            $sum: { $cond: ['$isAvailable', 1, 0] }
          }
        }
      },
      { $sort: { totalDonors: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donor location stats',
      error: error.message
    });
  }
};

// Request fulfillment rate
const getRequestFulfillmentRate = async (req, res) => {
  try {
    const stats = await BloodRequest.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          fulfilled: [{ $match: { status: 'fulfilled' } }, { $count: 'count' }],
          pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          cancelled: [{ $match: { status: 'cancelled' } }, { $count: 'count' }]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: stats[0].total[0]?.count || 0,
        fulfilled: stats[0].fulfilled[0]?.count || 0,
        pending: stats[0].pending[0]?.count || 0,
        cancelled: stats[0].cancelled[0]?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fulfillment rate',
      error: error.message
    });
  }
};

// Get all users for chat functionality
const getAllUsersForChat = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('name email role profileImage verified')
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users for chat',
      error: error.message
    });
  }
};

// Send blood donation reminders to eligible donors
const sendBloodDonationReminders = async (req, res) => {
  try {
    const { bloodType, minDays = 90 } = req.body;
    const emailService = require('../utils/emailService');

    // Build filter for donors - look for eligible candidates
    const donorFilter = {};

    // If specific blood type is requested
    if (bloodType) {
      donorFilter.bloodgroup = bloodType;
    }

    // ✅ FIXED: Find donors who either:
    // 1. Have a nextEligibleDate that is today or earlier and haven't been notified
    // 2. Have a lastDonationDate but no nextEligibleDate (for backward compatibility)
    const donors = await Donor.find({
      $or: [
        // Case 1: nextEligibleDate calculated and eligible
        {
          ...donorFilter,
          nextEligibleDate: { $lte: new Date() },
          isNotifiedForEligibility: { $ne: true }
        },
        // Case 2: Only lastDonationDate exists (backward compatibility)
        {
          ...donorFilter,
          lastDonationDate: { $exists: true, $ne: null },
          nextEligibleDate: { $exists: false },
          isNotifiedForEligibility: { $ne: true }
        }
      ]
    });

    if (donors.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No eligible donors found for blood type ${bloodType || 'all types'}`,
        data: { sent: 0, total: 0, skipped: 0 }
      });
    }

    let sentCount = 0;
    let skippedCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let donor of donors) {
      try {
        // ✅ FIXED: Consistent eligibility check
        let isEligible = false;
        let donationDateToUse = null;

        // Primary check: nextEligibleDate
        if (donor.nextEligibleDate) {
          if (donor.nextEligibleDate <= today) {
            isEligible = true;
            donationDateToUse = donor.lastDonationDate;
          }
        } 
        // Fallback: lastDonationDate calculation
        else if (donor.lastDonationDate) {
          const nextEligibleDate = new Date(donor.lastDonationDate);
          nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);
          
          if (nextEligibleDate <= today) {
            isEligible = true;
            donationDateToUse = donor.lastDonationDate;
          }
        }

        if (!isEligible) {
          skippedCount++;
          continue;
        }

        // Send reminder email using emailService
        try {
          await emailService.sendDonationReminderEmail(
            donor.email,
            donor.name,
            donationDateToUse || new Date()
          );

          // Create in-app notification
          await Notification.create({
            userId: donor.userId || donor._id,
            type: 'donation_reminder',
            title: 'Time to Donate Blood Again',
            message: `You are now eligible to donate ${bloodType || 'blood'}. Your donation can save up to 3 lives!`,
            relatedModel: 'Donor',
            relatedId: donor._id,
            priority: 'high',
            actionUrl: '/donor/donate'
          });

          // Mark as notified
          donor.isNotifiedForEligibility = true;
          await donor.save();

          sentCount++;
          console.log(`📧 Reminder sent to ${donor.email}`);
        } catch (emailError) {
          console.error('Email send error for donor:', donor.email, emailError.message);
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error processing donor ${donor.email}:`, error.message);
        skippedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Blood donation reminders sent successfully to ${sentCount} donors`,
      data: {
        sent: sentCount,
        total: donors.length,
        skipped: skippedCount,
        bloodType: bloodType || 'all'
      }
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send blood donation reminders',
      error: error.message
    });
  }
};

// Send message to all recipients
const sendMessageToAllRecipients = async (req, res) => {
  try {
    const { title, message, priority = 'medium' } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Get all recipient user IDs
    const recipients = await Recipient.find({}, 'userId');
    const recipientUserIds = recipients.map(r => r.userId).filter(id => id);

    if (recipientUserIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No recipients found to send message to',
        data: { sent: 0, total: 0 }
      });
    }

    // Create bulk notifications
    const notifications = recipientUserIds.map(userId => ({
      userId,
      type: 'system',
      title,
      message,
      priority,
      actionUrl: '/recipient/dashboard'
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit socket events to all recipients
    if (global.io) {
      recipientUserIds.forEach(userId => {
        global.io.to(`user-${userId}`).emit('newNotification', {
          notification: {
            type: 'system',
            title,
            message,
            priority,
            actionUrl: '/recipient/dashboard'
          },
          timestamp: new Date()
        });
      });
    }

    res.status(200).json({
      success: true,
      message: `Message sent successfully to ${recipientUserIds.length} recipients`,
      data: {
        sent: recipientUserIds.length,
        total: recipientUserIds.length,
        notifications: createdNotifications.length
      }
    });
  } catch (error) {
    console.error('Send message to recipients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message to recipients',
      error: error.message
    });
  }
};

// Send message to all donors
const sendMessageToAllDonors = async (req, res) => {
  try {
    const { title, message, priority = 'medium' } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Get all donor user IDs
    const donors = await Donor.find({}, 'userId');
    const donorUserIds = donors.map(d => d.userId).filter(id => id);

    if (donorUserIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No donors found to send message to',
        data: { sent: 0, total: 0 }
      });
    }

    // Create bulk notifications
    const notifications = donorUserIds.map(userId => ({
      userId,
      type: 'system',
      title,
      message,
      priority,
      actionUrl: '/donor/dashboard'
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit socket events to all donors
    if (global.io) {
      donorUserIds.forEach(userId => {
        global.io.to(`user-${userId}`).emit('newNotification', {
          notification: {
            type: 'system',
            title,
            message,
            priority,
            actionUrl: '/donor/dashboard'
          },
          timestamp: new Date()
        });
      });
    }

    res.status(200).json({
      success: true,
      message: `Message sent successfully to ${donorUserIds.length} donors`,
      data: {
        sent: donorUserIds.length,
        total: donorUserIds.length,
        notifications: createdNotifications.length
      }
    });
  } catch (error) {
    console.error('Send message to donors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message to donors',
      error: error.message
    });
  }
};

// Add to admin routes
module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllUsersForChat,
  updateUser,
  deleteUser,
  verifyUser,
  getSystemAnalytics,
  getBloodInventoryStatus,  // ADD
  getDonorsByLocation,      // ADD
  getRequestFulfillmentRate, // ADD
  sendBloodDonationReminders,
  sendMessageToAllRecipients, // ADD
  sendMessageToAllDonors      // ADD
};
