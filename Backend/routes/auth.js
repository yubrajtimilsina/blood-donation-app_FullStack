const express = require('express');
const { registerUser, loginUser, getCurrentUser, updatePassword } = require('../controllers/auth');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

// REGISTER Router
router.post("/register", registerUser);

// LOGIN Router
router.post("/login", loginUser);

// GET CURRENT USER
router.get("/me", verifyToken, getCurrentUser);

// UPDATE PASSWORD
router.put("/password", verifyToken, updatePassword);

module.exports = router;