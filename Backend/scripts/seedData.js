const mongoose = require('mongoose');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const Hospital = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Donor.deleteMany({});
    await Recipient.deleteMany({});
    await Hospital.deleteMany({});
    await BloodRequest.deleteMany({});

    console.log('Cleared existing data');

    // Create sample donors
    const donorUsers = [];
    const donors = [];

    const donorData = [
      { name: 'John Doe', email: 'john@example.com', phone: '1234567890', bloodgroup: 'A+', age: 30, weight: 70, address: 'Kathmandu, Nepal' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '1234567891', bloodgroup: 'O-', age: 25, weight: 65, address: 'Pokhara, Nepal' },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '1234567892', bloodgroup: 'B+', age: 35, weight: 75, address: 'Lalitpur, Nepal' },
      { name: 'Alice Brown', email: 'alice@example.com', phone: '1234567893', bloodgroup: 'AB+', age: 28, weight: 68, address: 'Bhaktapur, Nepal' },
      { name: 'Charlie Wilson', email: 'charlie@example.com', phone: '1234567894', bloodgroup: 'A-', age: 32, weight: 72, address: 'Kathmandu, Nepal' },
    ];

    for (const data of donorData) {
      const user = new User({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: CryptoJS.AES.encrypt('password123', process.env.PASS_SEC).toString(),
        role: 'donor',
        verified: true
      });

      const savedUser = await user.save();
      donorUsers.push(savedUser);

      const donor = new Donor({
        userId: savedUser._id,
        name: data.name,
        email: data.email,
        tel: data.phone,
        address: data.address,
        bloodgroup: data.bloodgroup,
        age: data.age,
        weight: data.weight,
        date: new Date().toISOString().split('T')[0],
        location: {
          type: 'Point',
          coordinates: [85.3240 + Math.random() * 0.1, 27.7172 + Math.random() * 0.1] // Random coordinates around Kathmandu
        },
        isAvailable: true
      });

      const savedDonor = await donor.save();
      donors.push(savedDonor);

      savedUser.donorProfile = savedDonor._id;
      await savedUser.save();
    }

    // Create sample recipients
    const recipientData = [
      { name: 'Mary Davis', email: 'mary@example.com', phone: '1234567895', address: 'Kathmandu, Nepal' },
      { name: 'Tom Anderson', email: 'tom@example.com', phone: '1234567896', address: 'Pokhara, Nepal' },
    ];

    for (const data of recipientData) {
      const user = new User({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: CryptoJS.AES.encrypt('password123', process.env.PASS_SEC).toString(),
        role: 'recipient',
        verified: true
      });

      const savedUser = await user.save();

      const recipient = new Recipient({
        userId: savedUser._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        location: {
          type: 'Point',
          coordinates: [85.3240 + Math.random() * 0.1, 27.7172 + Math.random() * 0.1]
        },
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '9876543210'
        },
        verified: true
      });

      const savedRecipient = await recipient.save();
      savedUser.recipientProfile = savedRecipient._id;
      await savedUser.save();
    }

    // Create sample hospital
    const hospitalUser = new User({
      name: 'City Hospital',
      email: 'hospital@example.com',
      phone: '1234567897',
      password: CryptoJS.AES.encrypt('password123', process.env.PASS_SEC).toString(),
      role: 'hospital',
      verified: true
    });

    const savedHospitalUser = await hospitalUser.save();

    const hospital = new Hospital({
      userId: savedHospitalUser._id,
      name: 'City General Hospital',
      email: 'hospital@example.com',
      phone: '1234567897',
      address: 'Kathmandu, Nepal',
      licenseNumber: 'HOSP001',
      location: {
        type: 'Point',
        coordinates: [85.3240, 27.7172]
      },
      bloodInventory: {
        'A+': 25,
        'A-': 12,
        'B+': 18,
        'B-': 8,
        'AB+': 6,
        'AB-': 3,
        'O+': 35,
        'O-': 15
      }
    });

    const savedHospital = await hospital.save();
    savedHospitalUser.hospitalProfile = savedHospital._id;
    await savedHospitalUser.save();

    // Create sample blood requests
    const bloodRequests = [
      {
        patientName: 'Patient One',
        bloodGroup: 'A+',
        unitsNeeded: 2,
        urgency: 'high',
        hospitalName: 'City General Hospital',
        address: 'Kathmandu, Nepal',
        contactPerson: 'Dr. Sharma',
        contactNumber: '1234567897',
        description: 'Emergency surgery',
        requiredBy: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'pending',
        location: {
          type: 'Point',
          coordinates: [85.3240, 27.7172]
        }
      },
      {
        patientName: 'Patient Two',
        bloodGroup: 'O-',
        unitsNeeded: 1,
        urgency: 'critical',
        hospitalName: 'City General Hospital',
        address: 'Kathmandu, Nepal',
        contactPerson: 'Dr. Patel',
        contactNumber: '1234567897',
        description: 'Accident victim',
        requiredBy: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        status: 'pending',
        location: {
          type: 'Point',
          coordinates: [85.3240, 27.7172]
        }
      }
    ];

    for (const requestData of bloodRequests) {
      const bloodRequest = new BloodRequest(requestData);
      await bloodRequest.save();
    }

    console.log('Sample data created successfully!');
    console.log(`Created ${donorUsers.length} donors`);
    console.log(`Created ${bloodRequests.length} blood requests`);
    console.log('Hospital login: hospital@example.com / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedData();
