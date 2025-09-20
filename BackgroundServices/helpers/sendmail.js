const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


dotenv.config();

function createTransporter(config) {
    const transporter = nodemailer.createTransport(config);
    return transporter;
}

let configuration = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

const sendMail = async (messageOptions) => {
    const transporter = createTransporter(configuration);
    await transporter.verify();
    await transporter.sendMail(messageOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};  

module.exports = sendMail;

