const ejs = require("ejs");
const dotenv = require("dotenv");
const BloodRequest = require("../models/BloodRequest");
const Donor = require("../models/Donor");
const sendMail = require("../helpers/sendmail");

dotenv.config();

const sendRequestNotification = async () => {
  try {
    // Find new blood requests (created in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const newRequests = await BloodRequest.find({
      createdAt: { $gte: fiveMinutesAgo },
      status: 'pending',
      notificationSent: { $ne: true }
    });

    if (newRequests.length > 0) {
      for (let request of newRequests) {
        // Find matching donors
        const matchingDonors = await Donor.find({
          bloodgroup: request.bloodGroup,
          isAvailable: true
        }).limit(50);

        for (let donor of matchingDonors) {
          ejs.renderFile(
            "templates/RequestNotification.ejs",
            {
              donorName: donor.name,
              patientName: request.patientName,
              bloodGroup: request.bloodGroup,
              unitsNeeded: request.unitsNeeded,
              hospitalName: request.hospitalName,
              urgency: request.urgency,
              contactNumber: request.contactNumber,
              address: request.address,
              requiredBy: new Date(request.requiredBy).toLocaleDateString()
            },
            async (err, data) => {
              if (err) {
                console.log("Template rendering error:", err);
                return;
              }

              let messageOptions = {
                from: process.env.EMAIL_USER,
                to: donor.email,
                subject: `Urgent: ${request.bloodGroup} Blood Needed - ${request.urgency.toUpperCase()} Priority`,
                html: data,
              };

              try {
                await sendMail(messageOptions);
                console.log(`Notification sent to ${donor.email}`);
              } catch (error) {
                console.log("Error sending email to " + donor.email, error);
              }
            }
          );
        }

        // Mark request as notified
        await BloodRequest.findByIdAndUpdate(request._id, {
          $set: { notificationSent: true }
        });
      }
    }
  } catch (error) {
    console.log("Error in sendRequestNotification:", error);
  }
};

module.exports = sendRequestNotification;
