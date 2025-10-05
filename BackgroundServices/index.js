const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cron = require('node-cron');

const mongoose = require('mongoose');
const dbConnection = require('./utils/db');
const sendDetailsProspectEmail = require('./EmailServices/sendDetailsProspect');
const sendEligibilityEmail = require('./EmailServices/sendEligibilityEmail');
const sendBloodDonationReminder = require('./EmailServices/sendBloodDonationReminder');
const sendDonorDetailsEmail = require('./EmailServices/sendDonorDetailsEmail');

dotenv.config();

// Server Port
const PORT = process.env.PORT || 3001

//Schedule Task
// REPLACE the run function:
const run = () => {
    // Run every hour instead of every second to prevent spam
    cron.schedule('0 */1 * * *', () => {
     console.log('Running background services...');
     sendDetailsProspectEmail();
     sendEligibilityEmail();
     sendBloodDonationReminder();
     sendDonorDetailsEmail();
    });
 }
 // Actually call the function!

app.listen(PORT, () => {
    console.log(`Background Services running on port ${PORT}`);
    dbConnection();
});

run();