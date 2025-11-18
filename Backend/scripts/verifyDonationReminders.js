const mongoose = require("mongoose");
require("dotenv").config();

const Donor = require("./models/Donor");


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    success("MongoDB Connected");
  } catch (err) {
    error("DB Error: " + err.message);
    process.exit(1);
  }
}


 async function createTestDonors() {
  log("\nCreating Test Donors...");

  await Donor.deleteMany({ email: { $regex: "test-donor" } });

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const fortyDaysAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000);

  await Donor.create([
    {
      name: "Eligible Donor",
      email: "test-donor-eligible@test.com",
      bloodgroup: "O+",
      lastDonationDate: ninetyDaysAgo,
      nextEligibleDate: ninetyDaysAgo,
      isNotifiedForEligibility: false,
    },
    {
      name: "Not Eligible Donor",
      email: "test-donor-ineligible@test.com",
      bloodgroup: "A+",
      lastDonationDate: fortyDaysAgo,
      nextEligibleDate: new Date(fortyDaysAgo.getTime() + 90 * 86400000),
      isNotifiedForEligibility: false,
    },
  ]);

  success("✔ Test donors created\n");
}


async function testCronQuery() {
  log("Testing Cron Query...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const donors = await Donor.find({
    nextEligibleDate: { $lte: today },
    isNotifiedForEligibility: { $ne: true },
  });

  if (donors.length === 0) {
    error("❌ Cron would NOT find any eligible donors");
  } else {
    success(`✔ Cron will find ${donors.length} eligible donor(s):`);
    donors.forEach((d) =>
      log(` - ${d.name} (${d.email}) eligible from: ${d.nextEligibleDate}`)
    );
  }
}


async function run() {
  await connectDB();
  await createTestDonors();
  await testCronQuery();

  mongoose.disconnect();
  success("\nAll tests completed.\n");
}

run();
