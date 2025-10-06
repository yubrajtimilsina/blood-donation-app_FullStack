const Recipient = require('../models/Recipient');
const User = require('../models/User');
const { geocodeAddress } = require('../utils/geocoding');

// Create recipient profile
const createRecipientProfile = async (req, res) => {
  try {
    const { name, email, phone, address, emergencyContact } = req.body;
    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await Recipient.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Recipient profile already exists'
      });
    }

    // Geocode address
    let location = { type: 'Point', coordinates: [0, 0] };
    if (address) {
      const geoResult = await geocodeAddress(address);
      if (geoResult) {
        location = geoResult;
      }
    }

    const recipient = new Recipient({
      userId,
      name,
      email,
      phone,
      address,
      location,
      emergencyContact
    });

    await recipient.save();

    // Update user with recipient profile reference
    await User.findByIdAndUpdate(userId, { 
      recipientProfile: recipient._id,
      role: 'recipient'
    });

    res.status(201).json({
      success: true,
      data: recipient,
      message: 'Recipient profile created successfully'
    });
  } catch (error) {
    console.error('Create recipient profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recipient profile',
      error: error.message
    });
  }
};

// Get recipient profile
const getRecipientProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const recipient = await Recipient.findOne({ userId }).populate('userId', 'name email');
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipient profile',
      error: error.message
    });
  }
};

// Update recipient profile
const updateRecipientProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // If address is being updated, geocode it
    if (updates.address) {
      const geoResult = await geocodeAddress(updates.address);
      if (geoResult) {
        updates.location = geoResult;
      }
    }

    const recipient = await Recipient.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipient,
      message: 'Recipient profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update recipient profile',
      error: error.message
    });
  }
};

// Get all recipients (admin only)
const getAllRecipients = async (req, res) => {
  try {
    const recipients = await Recipient.find()
      .populate('userId', 'name email verified')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipients.length,
      data: recipients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipients',
      error: error.message
    });
  }
};

// Verify recipient (admin only)
const verifyRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;

    const recipient = await Recipient.findByIdAndUpdate(
      recipientId,
      { verified: true },
      { new: true }
    );

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Also verify the user
    await User.findByIdAndUpdate(recipient.userId, { verified: true });

    res.status(200).json({
      success: true,
      data: recipient,
      message: 'Recipient verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify recipient',
      error: error.message
    });
  }
};

module.exports = {
  createRecipientProfile,
  getRecipientProfile,
  updateRecipientProfile,
  getAllRecipients,
  verifyRecipient
};
