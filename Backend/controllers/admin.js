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

    // Build filter for donors
    const donorFilter = { isAvailable: true }; // Only send to available donors

    // If specific blood type is requested
    if (bloodType) {
      donorFilter.bloodgroup = bloodType;
    }

    // Find all available donors (we'll check eligibility in the loop for backward compatibility)
    const donors = await Donor.find(donorFilter);

    if (donors.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No available donors found for blood type ${bloodType || 'all types'}`,
        data: { sent: 0, total: 0 }
      });
    }

    let sentCount = 0;
    const today = new Date();

    // Import email service
    const ejs = require('ejs');
    const path = require('path');
    const sendMail = require('../../BackgroundServices/helpers/sendmail');

    for (let donor of donors) {
      try {
        // Check eligibility
        let isEligible = true;

        if (donor.nextEligibleDate && donor.nextEligibleDate > today) {
          isEligible = false;
        } else if (donor.lastDonationDate) {
          // If lastDonationDate exists but nextEligibleDate is null, calculate it
          const nextDate = new Date(donor.lastDonationDate);
          nextDate.setDate(nextDate.getDate() + 90);
          if (nextDate > today) {
            isEligible = false;
          }
        } else if (donor.date) {
          // Fallback to old date field
          const donorDate = new Date(donor.date);
          const diffTime = Math.abs(today - donorDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < minDays) {
            isEligible = false;
          }
        }
        // If no date fields, assume eligible

        if (!isEligible) continue;

        // Send reminder email
        try {
          const templatePath = path.join(__dirname, '../../BackgroundServices/templates/BloodDonationReminder.ejs');
          const html = await new Promise((resolve, reject) => {
            ejs.renderFile(
              templatePath,
              {
                name: donor.name,
                date: (donor.lastDonationDate || donor.date || 'N/A').toString().split('T')[0],
              },
              (err, data) => {
                if (err) {
                  console.error('EJS render error:', err);
                  reject(err);
                } else {
                  resolve(data);
                }
              }
            );
          });

          let messageoptions = {
            from: process.env.EMAIL_USER,
            to: donor.email,
            subject: `Urgent: ${bloodType || 'Blood'} Donation Needed - Your Help Matters`,
            html: html,
          };

          await sendMail(messageoptions);
          sentCount++;

        } catch (emailError) {
          console.error('Email send error for donor:', donor.email, emailError);
          // Continue with next donor instead of failing completely
        }
      } catch (error) {
        console.error(`Error processing donor ${donor.email}:`, error);
        // Continue with next donor
      }
    }

    res.status(200).json({
      success: true,
      message: `Blood donation reminders sent successfully to ${sentCount} donors`,
      data: {
        sent: sentCount,
        total: donors.length,
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
