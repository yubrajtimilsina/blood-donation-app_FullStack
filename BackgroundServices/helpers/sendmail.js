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

const sendMail = (messageOptions) => {
    return new Promise((resolve, reject) => {
        const transporter = createTransporter(configuration);
        transporter.verify().then(() => {
            transporter.sendMail(messageOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        }).catch(reject);
    });
};

module.exports = sendMail;

