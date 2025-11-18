const cron = require('node-cron');
const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');
const Notification = require('../models/Notification');
const emailService = require('./emailService');

module.exports.startLowInventoryAlertCron = () => {
  const threshold = parseInt(process.env.LOW_INVENTORY_THRESHOLD_O_NEG || '2', 10);
  // Run daily at 8 AM Nepal time (change schedule as needed)
  cron.schedule(
    '0 8 * * *',
    async () => {
      console.log('🔔 Running low-inventory alert check for O-...');

      try {
        const hospitals = await Hospital.find({ 'bloodInventory.O-': { $lte: threshold } });
        const today = new Date();

        for (const hosp of hospitals) {
          const coords = hosp.location && Array.isArray(hosp.location.coordinates) ? hosp.location.coordinates : null;

          if (!coords || coords.length !== 2) {
            console.log(`Skipping ${hosp.name} (missing coordinates)`);
            continue;
          }

          // Find donors within 50 km radius (50,000 meters) who are O-, available and eligible
          const maxDistanceMeters = 50 * 1000;

          const donors = await Donor.find({
            bloodgroup: 'O-',
            isAvailable: true,
            nextEligibleDate: { $lte: today },
            location: {
              $nearSphere: {
                $geometry: { type: 'Point', coordinates: coords },
                $maxDistance: maxDistanceMeters
              }
            }
          }).limit(200);

          console.log(`Found ${donors.length} eligible O- donors near ${hosp.name}`);

          for (const donor of donors) {
            try {
              // Use existing email helper to notify donor (urgency set to 'low')
              await emailService.sendMatchNotificationEmail(
                donor.email,
                donor.name,
                hosp.name,
                'O-',
                'low'
              );

              // Create an in-app notification
              await Notification.create({
                userId: donor.userId || donor._id,
                type: 'system',
                title: `Low O- supply at ${hosp.name}`,
                message: `Hospital ${hosp.name} is running low on O- blood (${hosp.bloodInventory['O-']} units). Please consider donating if you're eligible.`,
                actionUrl: `/hospital/${hosp._id}`,
                priority: 'high'
              });

              console.log(`Alert sent to ${donor.email}`);
            } catch (err) {
              console.error(`Error notifying ${donor.email}:`, err.message);
            }
          }
        }
      } catch (err) {
        console.error('Error running low-inventory alert cron:', err.message);
      }
    },
    { timezone: 'Asia/Kathmandu' }
  );
};
