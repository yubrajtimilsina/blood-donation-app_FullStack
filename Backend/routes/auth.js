const express = require('express');
const { registerUser, loginUser, getCurrentUser, updatePassword, forgotPassword, resetPassword } = require('../controllers/auth');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

// REGISTER Router
router.post("/register", registerUser);

// HOSPITAL REGISTER Router
router.post("/register-hospital", registerUser);

// LOGIN Router
router.post("/login", loginUser);

// GET CURRENT USER
router.get("/me", verifyToken, getCurrentUser);

// UPDATE PASSWORD
router.put("/password", verifyToken, updatePassword);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

module.exports = router;
