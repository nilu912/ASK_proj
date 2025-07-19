import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

/**
 * Send email using nodemailer
 * @param options - Email options (recipient, subject, message, html)
 * @returns Promise<boolean> - True if email sent successfully, false otherwise
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'ASK Foundation'} <${process.env.EMAIL_FROM || 'noreply@askfoundation.org'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message.replace(/\n/g, '<br>'),
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/**
 * Generate email template for inquiry response
 * @param name - Recipient name
 * @param inquirySubject - Original inquiry subject
 * @param response - Response message
 * @returns HTML string - Formatted email template
 */
export const generateInquiryResponseEmail = (
  name: string,
  inquirySubject: string,
  response: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a6da7; color: white; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Response to Your Inquiry</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for contacting ASK Foundation. We are writing in response to your inquiry about "${inquirySubject}".</p>
          <p>${response}</p>
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>ASK Foundation Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} ASK Foundation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate email template for event registration confirmation
 * @param name - Recipient name
 * @param eventTitle - Event title
 * @param eventDate - Event date
 * @param eventLocation - Event location
 * @param registrationId - Registration ID
 * @returns HTML string - Formatted email template
 */
export const generateEventRegistrationEmail = (
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  registrationId: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a6da7; color: white; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4a6da7; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Event Registration Confirmation</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for registering for the following event:</p>
          <div class="details">
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
            <p><strong>Registration ID:</strong> ${registrationId}</p>
          </div>
          <p>Please keep this registration ID for your reference. You may be asked to provide it at the event.</p>
          <p>We look forward to seeing you at the event!</p>
          <p>Best regards,<br>ASK Foundation Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} ASK Foundation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate email template for donation receipt
 * @param name - Donor name
 * @param amount - Donation amount
 * @param donationId - Donation ID
 * @param date - Donation date
 * @returns HTML string - Formatted email template
 */
export const generateDonationReceiptEmail = (
  name: string,
  amount: number,
  donationId: string,
  date: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a6da7; color: white; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .receipt { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border: 1px solid #ddd; }
        .amount { font-size: 24px; font-weight: bold; color: #4a6da7; text-align: center; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Donation Receipt</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for your generous donation to ASK Foundation. Your support helps us continue our mission.</p>
          <div class="receipt">
            <div class="amount">$${amount.toFixed(2)}</div>
            <p><strong>Donation ID:</strong> ${donationId}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Donor:</strong> ${name}</p>
          </div>
          <p>This receipt serves as confirmation of your donation. Please keep it for your tax records.</p>
          <p>Thank you again for your generosity and support.</p>
          <p>Best regards,<br>ASK Foundation Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} ASK Foundation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};