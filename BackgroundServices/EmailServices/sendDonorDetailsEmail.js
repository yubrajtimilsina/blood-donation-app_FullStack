const ejs = require("ejs");
const dotenv = require("dotenv");
const Donor = require("../models/Donor");
const sendMail = require("../helpers/sendmail");

dotenv.config();


const sendDonorDetailsEmail = async () => {
    const donors = await Donor.find({ status: 1 });
    if (donors.length > 0) {
        for (let donor of donors) {
            ejs.renderFile(
                "templates/BloodDonationDonor.ejs",
                { name: donor.name, 
                age: donor.age, 
                weight: donor.weight,
                 email: donor.email,
                 phone: donor.phone,
                 bloodGroup: donor.bloodGroup,
                  address: donor.address,
                 diseases: donor.diseases,
                    bloodpressure: donor.bloodpressure,
                    date : donor.date
                },
                async (err, data) => {  
                    let messageoptions = {
                        from: process.env.EMAIL_USER,
                        to: donor.email,
                        subject: "Blood Donation Details",
                        html: data,
                    };
                    try {
                        await sendMail(messageoptions);
                        await Donor.findByIdAndUpdate(donor._id, { 
                            $set: { status: 1 }
                        }); //email sent
                    } catch (error) {
                        console.log("Error in sending email", error);
                    }       


                 },
            )
        }
    }
};

module.exports = sendDonorDetailsEmail;