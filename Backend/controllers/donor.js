const Donor = require("../models/Donor");
const User = require("../models/User");
const DonationHistory = require("../models/DonationHistory");
const { geocodeAddress } = require('../utils/geocoding');
const { findNearby } = require('../utils/distance');

// Create a new donor
const createDonor = async (req, res) => {
    try {
        const { name, email, tel, bloodgroup, age, weight, address } = req.body;
        
        if (!name || !email || !tel || !bloodgroup || !age || !weight) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Geocode address if provided
        let location = { type: 'Point', coordinates: [0, 0] };
        if (address) {
            const geoResult = await geocodeAddress(address);
            if (geoResult) {
                location = geoResult;
            }
        }

        const donorData = {
            ...req.body,
            location,
            date: req.body.date || new Date().toISOString().split('T')[0],
            lastDonationDate: req.body.date ? new Date(req.body.date) : new Date()
        };

        const newDonor = new Donor(donorData);
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

// Get all donors with filters
const getAlldonors = async (req, res) => {
    try {
        const { bloodgroup, isAvailable, search } = req.query;
        
        const filter = {};
        if (bloodgroup) filter.bloodgroup = bloodgroup;
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const donors = await Donor.find(filter)
            .populate('userId', 'name email verified')
            .sort({ createdAt: -1 });
            
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch donors",
            error: error.message
        });
    }
};

// Search nearby donors
const searchNearbyDonors = async (req, res) => {
    try {
        const { latitude, longitude, bloodgroup, radius = 50 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Location coordinates required'
            });
        }

        const coordinates = [parseFloat(longitude), parseFloat(latitude)];
        
        const filter = {
            isAvailable: true
        };
        if (bloodgroup) filter.bloodgroup = bloodgroup;

        const nearbyDonors = await findNearby(
            Donor,
            coordinates,
            parseInt(radius),
            filter
        );

        res.status(200).json({
            success: true,
            count: nearbyDonors.length,
            data: nearbyDonors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to search nearby donors',
            error: error.message
        });
    }
};

// Update donor
const updateDonor = async (req, res) => {
    try {
        const updates = req.body;

        // Geocode address if being updated
        if (updates.address) {
            const geoResult = await geocodeAddress(updates.address);
            if (geoResult) {
                updates.location = geoResult;
            }
        }

        // Update last donation date if provided
        if (updates.date) {
            updates.lastDonationDate = new Date(updates.date);
        }

        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
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

// Toggle availability
const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;

        const donor = await Donor.findByIdAndUpdate(
            id,
            { isAvailable: isAvailable !== undefined ? isAvailable : true },
            { new: true }
        );

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: donor,
            message: `Donor availability updated to ${donor.isAvailable ? 'available' : 'unavailable'}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update availability',
            error: error.message
        });
    }
};

// Get one donor
const getOneDonor = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id)
            .populate('userId', 'name email verified');
        
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }

        // Get donation history
        const donationHistory = await DonationHistory.find({ donorId: donor._id })
            .sort({ donationDate: -1 })
            .limit(10);
        
        res.status(200).json({
            ...donor.toObject(),
            donationHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch donor",
            error: error.message
        });
    }
};

// Delete a donor
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

// STATISTICS
const getDonorsStats = async (req, res) => {
    try {
        const stats = await Donor.aggregate([
            {
                $group: {
                    _id: "$bloodgroup",
                    count: { $sum: 1 },
                    available: {
                        $sum: { $cond: ["$isAvailable", 1, 0] }
                    }
                }
            }
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

// Monthly donations
const getDonorsMonthly = async (req, res) => {
    try {
        const months = parseInt(req.query.months || '6');
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - (months - 1));
        fromDate.setHours(0, 0, 0, 0);

        const stats = await Donor.aggregate([
            { $match: { createdAt: { $gte: fromDate } } },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    },
                    donations: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch monthly donor stats", 
            error: error.message 
        });
    }
};

// Record donation
const recordDonation = async (req, res) => {
    try {
        const { donorId } = req.params;
        const { requestId, location, recipientName, unitsGiven, notes } = req.body;

        const donor = await Donor.findById(donorId);
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        // Create donation history record
        const donation = new DonationHistory({
            donorId,
            requestId,
            bloodGroup: donor.bloodgroup,
            unitsGiven: unitsGiven || 1,
            location,
            recipientName,
            notes,
            status: 'completed'
        });

        await donation.save();

        // Update donor info
        await Donor.findByIdAndUpdate(donorId, {
            $inc: { totalDonations: 1 },
            lastDonationDate: new Date(),
            date: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({
            success: true,
            data: donation,
            message: 'Donation recorded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to record donation',
            error: error.message
        });
    }
};

// Get donation history
const getDonationHistory = async (req, res) => {
    try {
        const { donorId } = req.params;
        
        const history = await DonationHistory.find({ donorId })
            .populate('requestId')
            .sort({ donationDate: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch donation history',
            error: error.message
        });
    }
};

module.exports = {
    createDonor,
    getAlldonors,
    searchNearbyDonors,
    getOneDonor,
    updateDonor,
    toggleAvailability,
    deleteDonor,
    getDonorsStats,
    getDonorsMonthly,
    recordDonation,
    getDonationHistory
};