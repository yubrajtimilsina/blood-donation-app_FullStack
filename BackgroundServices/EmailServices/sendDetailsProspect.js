const ejs = require('ejs');
const dotenv = require('dotenv');
const Prospect = require('../models/Prospect');
const sendMail = require('../helpers/sendmail');

dotenv.config();

const sendDetailsProspectEmail = async () => {
    const prospects = await Prospect.find({ status:0 });
    if (prospects.length > 0) {
        for (let prospect of prospects) {
            ejs.renderFile("templates/BloodDonationProspect.ejs", 
                { name: prospect.name }, 
                async(err, data) => {
                let messageOptions = {
                    from: process.env.EMAIL_USER,
                    to: prospect.email,
                    subject: "Details for Blood Donation",
                    html: data
                };

                try {
                    sendMail(messageOptions);
                    await Prospect.findByIdAndUpdate(prospect._id, { $set: { status: 1 } });
                } catch (error) {
                    console.log("Error sending email to " + prospect.email + ": " + error);
                }
            });
        }
    }  
};

module.exports = sendDetailsProspectEmail;
