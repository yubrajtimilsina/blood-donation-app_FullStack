const ejs = require("ejs");
const dotenv = require("dotenv");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const sendMail = require("../helpers/sendmail");

dotenv.config();

const sendMatchNotification = async (donorId, recipientId, requestDetails) => {
  try {
    const donor = await Donor.findById(donorId);
    const recipient = await Recipient.findById(recipientId);

    if (!donor || !recipient) {
      console.log("Donor or Recipient not found");
      return;
    }

    // Send email to donor
    ejs.renderFile(
      "templates/MatchNotification.ejs",
      {
        recipientType: 'donor',
        name: donor.name,
        bloodGroup: requestDetails.bloodGroup,
        hospitalName: requestDetails.hospitalName,
        contactNumber: requestDetails.contactNumber,
        address: requestDetails.address
      },
      async (err, data) => {
        if (err) {
          console.log("Template rendering error:", err);
          return;
        }

        let messageOptions = {
          from: process.env.EMAIL_USER,
          to: donor.email,
          subject: "Blood Donation Match Found!",
          html: data,
        };

        try {
          await sendMail(messageOptions);
          console.log(`Match notification sent to donor ${donor.email}`);
        } catch (error) {
          console.log("Error sending email to donor:", error);
        }
      }
    );

    // Send email to recipient
    ejs.renderFile(
      "templates/MatchNotification.ejs",
      {
        recipientType: 'recipient',
        name: recipient.name,
        donorName: donor.name,
        bloodGroup: donor.bloodgroup,
        donorPhone: donor.tel
      },
      async (err, data) => {
        if (err) {
          console.log("Template rendering error:", err);
          return;
        }

        let messageOptions = {
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject: "Donor Match Found for Your Blood Request!",
          html: data,
        };

        try {
          await sendMail(messageOptions);
          console.log(`Match notification sent to recipient ${recipient.email}`);
        } catch (error) {
          console.log("Error sending email to recipient:", error);
        }
      }
    );
  } catch (error) {
    console.log("Error in sendMatchNotification:", error);
  }
};

module.exports = sendMatchNotification;