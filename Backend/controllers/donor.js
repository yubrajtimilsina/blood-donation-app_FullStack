const Donor = require("../models/Donor");

// Create a new donor
const createDonor = async (req, res) => {
    try {
        const newDonor = Donor(req.body);
        const donor = await newDonor.save();
        res.status(201).json(donor);
    } catch (error) {
        res.status(500).json(error);
    }  
};

// Get all donor
const getAlldonors = async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json(error);
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
        res.status(200).json(updatedDonor);
    } catch (error) {
        res.status(500).json(error);
    }  
};

//get One donor
const getOneDonor = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        res.status(200).json(donor);
    } catch (error) {
        res.status(500).json(error);
    }
};

//delete a donor
const deleteDonor = async (req, res) => {
    try {
        await Donor.findByIdAndDelete(req.params.id);
        res.status(200).json("Donor deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
};

//STATISTICS
const getDonorsStats = async (req, res) => {
  try {
    const stats = await Donor.aggregate([
      {
        $group: {
          _id: "$bloodgroup",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json(error);
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

