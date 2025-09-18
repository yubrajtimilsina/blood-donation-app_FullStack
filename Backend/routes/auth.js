const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth');
const router = express.Router();


//REGISTER Router
router.post("/register", registerUser);
//LOGIN Router
router.post("/login", loginUser);


module.exports = router;