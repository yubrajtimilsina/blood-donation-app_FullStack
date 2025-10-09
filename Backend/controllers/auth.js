const CryptoJS = require("crypto-js");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const Hospital = require("../models/Hospital");
const jwt = require("jsonwebtoken"); 
const dotenv = require("dotenv");

dotenv.config();

// REGISTER
const registerUser = async(req, res) => {
    try {
        const { name, email, password, role, phone, gender, dateOfBirth } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            phone,
            gender,
            dateOfBirth,
            password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
            role: role || 'donor' // default to donor
        });

        const savedUser = await newUser.save();

        // Create role-specific profile
        if (savedUser.role === 'donor') {
            const donorProfile = new Donor({
                userId: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                tel: phone || '',
                address: '',
                bloodgroup: req.body.bloodgroup || '',
                weight: req.body.weight || 50,
                date: new Date().toISOString().split('T')[0]
            });
            const savedDonor = await donorProfile.save();
            savedUser.donorProfile = savedDonor._id;
            await savedUser.save();
        } else if (savedUser.role === 'recipient') {
            const recipientProfile = new Recipient({
                userId: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: phone || '',
                address: ''
            });
            const savedRecipient = await recipientProfile.save();
            savedUser.recipientProfile = savedRecipient._id;
            await savedUser.save();
        } else if (savedUser.role === 'hospital') {
            const hospitalProfile = new Hospital({
                userId: savedUser._id,
                name: req.body.hospitalName || savedUser.name,
                email: savedUser.email,
                phone: phone || '',
                address: req.body.address || '',
                licenseNumber: req.body.licenseNumber || ''
            });
            const savedHospital = await hospitalProfile.save();
            savedUser.hospitalProfile = savedHospital._id;
            await savedUser.save();
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = savedUser._doc;

        res.status(201).json({
            success: true,
            data: userWithoutPassword,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

// LOGIN
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email })
            .populate('donorProfile')
            .populate('recipientProfile')
            .populate('hospitalProfile');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (OriginalPassword !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token with role
        const accessToken = jwt.sign(
            { 
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SEC,
            { expiresIn: "30d" }
        );

        const { password: _, ...info } = user._doc;

        res.status(200).json({
            success: true,
            ...info,
            accessToken,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

// GET CURRENT USER
const getCurrentUser = async(req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select('-password')
            .populate('donorProfile')
            .populate('recipientProfile')
            .populate('hospitalProfile');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message
        });
    }
};

// UPDATE PASSWORD
const updatePassword = async(req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new passwords are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== currentPassword) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Update password
        user.password = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update password",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updatePassword
};