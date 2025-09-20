const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cron = require('node-cron');

const mongoose = require('mongoose');
const dbConnection = require('./utils/db');
const sendDetailsProspectEmail = require('./EmailServices/sendDetailsProspect');
const sendEligibilityEmail = require('./EmailServices/sendEligibilityEmail');
const sendBloodDonationReminder = require('./EmailServices/sendBloodDonationReminder');


dotenv.config();

//Server Port
const PORT = process.env.PORT

//Schedule Task
const run = () => {
   cron.schedule('* * * * * ', () => {
    sendDetailsProspectEmail();
    sendEligibilityEmail();
    sendBloodDonationReminder();
   });
    
}


app.listen(PORT, () => {
    console.log(`Background Services running on port ${PORT}`);
    dbConnection();
});