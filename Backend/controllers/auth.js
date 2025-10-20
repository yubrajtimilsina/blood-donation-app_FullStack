const CryptoJS = require("crypto-js");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const Hospital = require("../models/Hospital");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, gender, dateOfBirth, bloodgroup } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
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
      role: role || "donor", // default to donor
    });

    const savedUser = await newUser.save();

    // Create role-specific profile
    if (savedUser.role === "donor") {
      const donorProfile = new Donor({
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        tel: phone || "",
        address: "",
        bloodgroup: bloodgroup || "",
        weight: req.body.weight || 50,
        age: req.body.age || 18,
        date: new Date().toISOString().split("T")[0],
      });
      const savedDonor = await donorProfile.save();
      savedUser.donorProfile = savedDonor._id;
      await savedUser.save();
    } else if (savedUser.role === "recipient") {
      const recipientProfile = new Recipient({
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: phone || "",
        address: "",
      });
      const savedRecipient = await recipientProfile.save();
      savedUser.recipientProfile = savedRecipient._id;
      await savedUser.save();
    } else if (savedUser.role === "hospital") {
      const hospitalProfile = new Hospital({
        userId: savedUser._id,
        name: req.body.hospitalName || savedUser.name,
        email: savedUser.email,
        phone: phone || "",
        address: req.body.address || "",
        licenseNumber: req.body.licenseNumber || "",
        bloodInventory: {
          'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
          'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
        }
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
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// LOGIN - FIXED
// FIXED LOGIN RESPONSE
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email })
      .populate("donorProfile")
      .populate("recipientProfile")
      .populate("hospitalProfile");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SEC,
      { expiresIn: "30d" }
    );

    const { password: _, ...userInfo } = user._doc;

    // ✅ CONSISTENT RESPONSE STRUCTURE
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      verified: user.verified,
      donorProfile: user.donorProfile,
      recipientProfile: user.recipientProfile,
      hospitalProfile: user.hospitalProfile,
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("donorProfile")
      .populate("recipientProfile")
      .populate("hospitalProfile");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// UPDATE PASSWORD
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = CryptoJS.AES.encrypt(
      newPassword,
      process.env.PASS_SEC
    ).toString();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // For now, just return the token in response (in production, send via email)
    // TODO: Integrate email service (e.g., Nodemailer with SendGrid/Mailgun)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    console.log('Password reset token generated for:', email);
    console.log('Reset URL:', resetUrl);

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
      // In development, include the reset URL for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl, resetToken })
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message,
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
