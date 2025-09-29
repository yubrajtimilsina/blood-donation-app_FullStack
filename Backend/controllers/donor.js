// Backend/controllers/donor.js - REPLACE ENTIRE CONTENT
const Donor = require("../models/Donor");

// Create a new donor
const createDonor = async (req, res) => {
    try {
        // Ensure required fields are present
        const { name, email, tel, bloodgroup, age, weight } = req.body;
        
        if (!name || !email || !tel || !bloodgroup || !age || !weight) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, email, tel, bloodGroup, age, weight"
            });
        }

        // Create donor data with current date if not provided
        const donorData = {
            ...req.body,
            date: req.body.date || new Date().toISOString().split('T')[0] // Current date if not provided
        };

        const newDonor = new Donor(donorData); // FIXED: added 'new'
        const donor = await newDonor.save();
        
        res.status(201).json({
            success: true,
            data: donor,
            message: "Donor created successfully"
        });
    } catch (error) {
        console.error("Error creating donor:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create donor",
            error: error.message
        });
    }  
};

// Get all donor
const getAlldonors = async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch donors",
            error: error.message
        });
    }
};

//Update a donor
const updateDonor = async (req, res) => {
    try {
        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        if (!updatedDonor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedDonor,
            message: "Donor updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update donor",
            error: error.message
        });
    }  
};

//get One donor
const getOneDonor = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }
        
        res.status(200).json(donor);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch donor",
            error: error.message
        });
    }
};

//delete a donor
const deleteDonor = async (req, res) => {
    try {
        const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
        
        if (!deletedDonor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Donor deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete donor",
            error: error.message
        });
    }
};

//STATISTICS
const getDonorsStats = async (req, res) => {
  try {
    const stats = await Donor.aggregate([
      {
        $group: {
          _id: "$bloodgroup", // Updated field name
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message
    });
  }
};

module.exports = {
    createDonor,
    getAlldonors,
    getOneDonor,
    updateDonor,
    deleteDonor,
    getDonorsStats
};