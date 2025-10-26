const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Blood Donation App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Blood Donation App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Password Reset Request</h2>
          <p>You requested a password reset for your Blood Donation App account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Blood Donation App - Save Lives, Donate Blood</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, name, role) {
    const mailOptions = {
      from: `"Blood Donation App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Blood Donation App!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Welcome to Blood Donation App, ${name}!</h2>
          <p>Thank you for joining our mission to save lives through blood donation.</p>
          <p>Your account has been created successfully as a <strong>${role}</strong>.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>What you can do:</h3>
            <ul>
              ${role === 'donor' ? `
                <li>Update your donor profile and availability</li>
                <li>View nearby blood requests</li>
                <li>Connect with recipients in need</li>
                <li>Track your donation history</li>
              ` : role === 'recipient' ? `
                <li>Create blood requests</li>
                <li>Search for available donors</li>
                <li>Communicate with potential donors</li>
                <li>Manage your requests</li>
              ` : role === 'hospital' ? `
                <li>Manage blood inventory</li>
                <li>View local donor database</li>
                <li>Handle blood requests</li>
                <li>Send notifications to donors</li>
              ` : `
                <li>Manage users and hospitals</li>
                <li>View system analytics</li>
                <li>Oversee blood donation operations</li>
              `}
            </ul>
          </div>
          <p>Start by logging into your account and completing your profile.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Login Now</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Blood Donation App - Save Lives, Donate Blood</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendDonationReminderEmail(email, name, lastDonationDate) {
    const nextEligibleDate = new Date(lastDonationDate);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

    const mailOptions = {
      from: `"Blood Donation App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Time to Donate Blood Again!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Hello ${name}, Ready to Save Lives Again?</h2>
          <p>Your last blood donation was on <strong>${lastDonationDate.toDateString()}</strong>.</p>
          <p>You are now eligible to donate again! Your next donation can help save up to 3 lives.</p>
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Next Eligible Date: ${nextEligibleDate.toDateString()}</h3>
            <p>Remember to stay hydrated and eat well before donating!</p>
          </div>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/donor/eligibility" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Check Eligibility</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Blood Donation App - Save Lives, Donate Blood</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Donation reminder email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending donation reminder email:', error);
      throw error;
    }
  }

  async sendMatchNotificationEmail(email, name, donorName, bloodGroup, urgency) {
    const mailOptions = {
      from: `"Blood Donation App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Urgent: Blood Match Found - ${bloodGroup} ${urgency === 'critical' ? 'CRITICAL' : 'Needed'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${urgency === 'critical' ? '#dc2626' : '#d97706'};">Blood Match Found!</h2>
          <p>Dear ${name},</p>
          <p>Great news! We've found a potential donor match for your blood request.</p>
          <div style="background-color: ${urgency === 'critical' ? '#fef2f2' : '#fffbeb'}; border-left: 4px solid ${urgency === 'critical' ? '#dc2626' : '#d97706'}; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Match Details:</h3>
            <ul>
              <li><strong>Blood Group:</strong> ${bloodGroup}</li>
              <li><strong>Potential Donor:</strong> ${donorName}</li>
              <li><strong>Urgency:</strong> ${urgency.toUpperCase()}</li>
            </ul>
          </div>
          <p>Please log in to your account to connect with the donor and coordinate the donation.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/recipient/chat" style="background-color: ${urgency === 'critical' ? '#dc2626' : '#d97706'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Contact Donor</a>
          <p style="color: #666; font-size: 12px;">This is an automated notification. Please respond promptly for urgent requests.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Blood Donation App - Save Lives, Donate Blood</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Match notification email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending match notification email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
