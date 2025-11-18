const cron = require("node-cron");
const Donor = require("../models/Donor");
const emailService = require("./emailService");

module.exports.startDonationReminderCron = () => {
  // Run every day at 9 AM Nepal time
  cron.schedule(
    "0 9 * * *",
    async () => {
      console.log("🔄 Running 90-day donor eligibility check...");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
     
        const donors = await Donor.find({
          $or: [
            // Case 1: nextEligibleDate exists and is today or earlier, and not yet notified
            {
              nextEligibleDate: { $lte: today },
              isNotifiedForEligibility: { $ne: true }
            },
            // Case 2: lastDonationDate exists, no nextEligibleDate, 90 days passed, not notified
            {
              lastDonationDate: { $exists: true, $ne: null },
              nextEligibleDate: { $exists: false },
              isNotifiedForEligibility: { $ne: true }
            }
          ]
        });

        console.log(`✅ Found ${donors.length} eligible donors for reminders`);

        let sentCount = 0;
        let errorCount = 0;

        for (const donor of donors) {
          try {
            // Verify donor is actually eligible (double-check)
            let isEligible = false;
            let donationDateToUse = null;

            if (donor.nextEligibleDate && donor.nextEligibleDate <= today) {
              isEligible = true;
              donationDateToUse = donor.lastDonationDate;
            } else if (donor.lastDonationDate && !donor.nextEligibleDate) {
              // Calculate eligibility from lastDonationDate
              const nextEligibleDate = new Date(donor.lastDonationDate);
              nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);
              
              if (nextEligibleDate <= today) {
                isEligible = true;
                donationDateToUse = donor.lastDonationDate;
              }
            }

            if (!isEligible) {
              console.log(`⏭️ Donor ${donor.email} not yet eligible, skipping`);
              continue;
            }

            // Send reminder email
            await emailService.sendDonationReminderEmail(
              donor.email,
              donor.name,
              donationDateToUse || new Date()
            );

            // Mark as notified
            donor.isNotifiedForEligibility = true;
            await donor.save();

            sentCount++;
            console.log(`📧 Reminder sent to ${donor.email}`);
          } catch (err) {
            errorCount++;
            console.error(`❌ Error sending reminder to ${donor.email}:`, err.message);
          }
        }

        console.log(`✅ Cron completed: ${sentCount} reminders sent, ${errorCount} errors`);
      } catch (err) {
        console.error(`❌ Error in donation reminder cron:`, err.message);
      }
    },
    { timezone: "Asia/Kathmandu" }
  );
};
