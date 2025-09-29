const ejs = require("ejs");
const dotenv = require("dotenv");
const Donor = require("../models/Donor");
const sendMail = require("../helpers/sendmail");

dotenv.config();

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const sendBloodDonationReminder = async () => {
  const donors = await Donor.find();
  if (donors.length > 0) {
    for (let donor of donors) {
      // calculate the difference between donor date and today's date
      const donorDate = new Date(donor.date);
      const today = new Date();
      const diffTime = Math.abs(today - donorDate);
      const diffDays = Math.cell(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 90) {
        ejs.renderFile(
          "templates/BloodDonationReminder.ejs",
          {
            name: donor.name,
            date: donor.date,
          },

          async (err, data) => {
            let messageoptions = {
               from: process.env.EMAIL_USER,
               to: donor.email,
                subject: "Blood Donation Reminder",
              html: data,
            };
            try {
              await sendMail(messageoptions);
              const formattedDate = formatDate(today);
              await Donor.findByIdAndUpdate(donor._id, {
                $set: { date: formattedDate },
              });
            } catch (error) {
              console.log(error);
            }
          }
        );
      }
    }
  }
};

module.exports = sendBloodDonationReminder;
