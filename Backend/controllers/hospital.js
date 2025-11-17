const Hospital = require("../models/Hospital");
const User = require("../models/User");
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequest");

// Get hospital profile by user ID
const getHospitalProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let hospital = await Hospital.findOne({ userId });

    // If hospital doesn't exist, create default profile
    if (!hospital) {
      const user = await User.findById(userId);
      hospital = new Hospital({
        userId,
        name: user.name || 'Hospital',
        email: user.email,
        phone: user.phone || '000-000-0000',
        address: 'Address not set',
        licenseNumber: 'TEMP-' + Date.now(),
        bloodInventory: {
          'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
          'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
        },
        location: { type: 'Point', coordinates: [0, 0] }
      });
      await hospital.save();

      // Update user with hospital profile reference
      await User.findByIdAndUpdate(userId, { hospitalProfile: hospital._id });
    }

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

    if (!bloodInventory || typeof bloodInventory !== 'object') {
      return res.status(400).json({
        success: false,
        message: "bloodInventory object is required"
      });
    }

    const hospital = await Hospital.findOneAndUpdate(
      { userId },
      { bloodInventory },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }
     res.status(200).json({
      success: true,
      data: hospital.bloodInventory,
      message: "Blood inventory updated successfully"
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
        message: "Hospital profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: hospital.bloodInventory
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

// Get all hospitals (admin)
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate('userId', 'name email verified')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
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

// Get local donors for hospital
const getLocalDonors = async (req, res) => {
  try {
    const userId = req.user.id;
    const hospital = await Hospital.findOne({ userId });

    if (!hospital || !hospital.location || hospital.location.coordinates[0] === 0) {
      // Fallback: return all available donors
      const donors = await Donor.find({ isAvailable: true })
        .populate('userId', 'name email phone')
        .limit(50);

      return res.status(200).json({
        success: true,
        data: donors,
        count: donors.length
      });
    }

    // Find donors within 50km of hospital
    const donors = await Donor.find({
      isAvailable: true,
      location: {
        $near: {
          $geometry: hospital.location,
          $maxDistance: 50000, // 50km in meters
        },
      },
    })
      .populate('userId', 'name email phone')
      .limit(50);

    res.status(200).json({
      success: true,
      data: donors,
      count: donors.length
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

    // Get requests from this hospital or nearby
    const hospital = await Hospital.findOne({ userId });
    let requests;

    if (hospital && hospital.location && hospital.location.coordinates[0] !== 0) {
      // Find requests within 50km of hospital
      requests = await BloodRequest.find({
        location: {
          $near: {
            $geometry: hospital.location,
            $maxDistance: 50000,
          },
        },
      }).populate('createdBy', 'name phone');
    } else {
      // Fallback: get all pending requests
      requests = await BloodRequest.find({ status: 'pending' })
        .populate('createdBy', 'name phone')
        .sort({ createdAt: -1 });
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

// Get My Hospital Profile (alias for getHospitalProfile)
const getMyHospitalProfile = async (req, res) => {
  return getHospitalProfile(req, res);
};

// Add hospital verification endpoint
const verifyHospitalLicense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { licenseNumber } = req.body;

    if (!licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "License number is required"
      });
    }

    const hospital = await Hospital.findOneAndUpdate(
      { userId },
      {
        licenseNumber,
        verified: true,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
      message: "Hospital verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify hospital",
      error: error.message
    });
  }
};

// Get all hospitals for public search
const getAllHospitalsPublic = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const hospitals = await Hospital.find(filter)
      .populate('userId', 'name email verified')
      .select('name address phone email location verified services')
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Hospital.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: hospitals,
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
      message: 'Failed to fetch hospitals',
      error: error.message
    });
  }
};

// Search hospitals nearby
const searchHospitalsNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, search } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required for nearby search'
      });
    }

    const filter = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      }
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const hospitals = await Hospital.find(filter)
      .populate('userId', 'name email verified')
      .select('name address phone email location verified services')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: hospitals,
      count: hospitals.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search nearby hospitals',
      error: error.message
    });
  }
};

module.exports = {
  getHospitalProfile,
  getMyHospitalProfile,
  updateHospitalProfile,
  updateBloodInventory,
  getBloodInventory,
  getAllHospitals,
  getLocalDonors,
  getHospitalRequests,
  verifyHospitalLicense,
  getAllHospitalsPublic,
  searchHospitalsNearby
};
