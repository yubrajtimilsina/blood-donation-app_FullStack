require('dotenv').config();
const dbConnection = require('../utils/db');
const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');
const Notification = require('../models/Notification');
const emailService = require('../utils/emailService');

(async () => {
  try {
    await dbConnection();
    console.log('DB connected. Running low-inventory check...');

    const threshold = parseInt(process.env.LOW_INVENTORY_THRESHOLD_O_NEG || '2', 10);
    const hospitals = await Hospital.find({ 'bloodInventory.O-': { $lte: threshold } });
    const today = new Date();

    for (const hosp of hospitals) {
      const coords = hosp.location && Array.isArray(hosp.location.coordinates) ? hosp.location.coordinates : null;
      if (!coords || coords.length !== 2) {
        console.log(`Skipping ${hosp.name} (missing coordinates)`);
        continue;
      }

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
          await emailService.sendMatchNotificationEmail(donor.email, donor.name, hosp.name, 'O-', 'low');

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

    console.log('Low-inventory check complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error running low-inventory check script:', err.message);
    process.exit(1);
  }
})();
