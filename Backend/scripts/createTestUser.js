const mongoose = require('mongoose');
const User = require('../models/User');
const Donor = require('../models/Donor');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // Check if user exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const newUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: CryptoJS.AES.encrypt('test123', process.env.PASS_SEC).toString(),
      role: 'donor',
      verified: true
    });

    const savedUser = await newUser.save();

    // Create donor profile
    const donorProfile = new Donor({
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      tel: '',
      address: '',
      bloodgroup: 'O+',
      weight: 70,
      date: new Date().toISOString().split('T')[0]
    });

    const savedDonor = await donorProfile.save();
    savedUser.donorProfile = savedDonor._id;
    await savedUser.save();

    console.log('Test user created: test@example.com / test123');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createTestUser();
