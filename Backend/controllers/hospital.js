const Hospital = require("../models/Hospital");

// Get hospital profile by user ID
const getHospitalProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const hospital = await Hospital.findOne({ userId });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital profile not found",
      });
    }

    // Add createdAt and updatedAt dates to response
    const hospitalData = hospital.toObject();
    hospitalData.createdAt = hospital.createdAt;
    hospitalData.updatedAt = hospital.updatedAt;

    res.status(200).json({
      success: true,
      data: hospitalData,
    });
  } catch (error) {
    console.error("Error fetching hospital profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospital profile",
      error: error.message,
    });
  }
};

// Update hospital profile
const updateHospitalProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const hospital = await Hospital.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
      message: "Hospital profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating hospital profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update hospital profile",
      error: error.message,
    });
  }
};

// Update blood inventory
const updateBloodInventory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bloodInventory } = req.body;

    const hospital = await Hospital.findOneAndUpdate(
      { userId },
      { bloodInventory },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hospital.bloodInventory,
      message: "Blood inventory updated successfully",
    });
  } catch (error) {
    console.error("Error updating blood inventory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blood inventory",
      error: error.message,
    });
  }
};

// Get blood inventory
const getBloodInventory = async (req, res) => {
  try {
    const userId = req.user.id;
    const hospital = await Hospital.findOne({ userId });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hospital.bloodInventory,
    });
  } catch (error) {
    console.error("Error fetching blood inventory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blood inventory",
      error: error.message,
    });
  }
};

// Get all hospitals (admin only)
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({})
      .populate('userId', 'name email phone')
      .select('name address phone bloodInventory location');

    res.status(200).json({
      success: true,
      data: hospitals,
    });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals",
      error: error.message,
    });
  }
};

// Get local donors within radius
const getLocalDonors = async (req, res) => {
  try {
    const userId = req.user.id;
    const radius = parseInt(req.query.radius) || 10; // Default 10km

    // Get hospital location
    const hospital = await Hospital.findOne({ userId });
    if (!hospital || !hospital.location) {
      return res.status(400).json({
        success: false,
        message: "Hospital location not found",
      });
    }

    const Donor = require("../models/Donor");

    // Find donors within radius
    const donors = await Donor.find({
      location: {
        $near: {
          $geometry: hospital.location,
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
      isAvailable: true,
    }).populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      data: donors,
    });
  } catch (error) {
    console.error("Error fetching local donors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch local donors",
      error: error.message,
    });
  }
};

// Get hospital requests
const getHospitalRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const BloodRequest = require("../models/BloodRequest");

    // Get requests from this hospital or nearby
    const hospital = await Hospital.findOne({ userId });
    let requests;

    if (hospital && hospital.location) {
      // Find requests within 50km of hospital
      requests = await BloodRequest.find({
        location: {
          $near: {
            $geometry: hospital.location,
            $maxDistance: 50000, // 50km
          },
        },
      }).populate('recipientId', 'name phone');
    } else {
      // Fallback: get all pending requests
      requests = await BloodRequest.find({ status: 'pending' })
        .populate('recipientId', 'name phone');
    }

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching hospital requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospital requests",
      error: error.message,
    });
  }
};

module.exports = {
  getHospitalProfile,
  updateHospitalProfile,
  updateBloodInventory,
  getBloodInventory,
  getAllHospitals,
  getLocalDonors,
  getHospitalRequests,
};
