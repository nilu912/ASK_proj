import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // CRITICAL FIX: The function is 'createTransport', not 'createTransporter'.
  // For Gmail
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail app password
    }
  });

  // For other email services (like your organization's email)
  // return nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST, // e.g., smtp.yourdomain.com
  //   port: process.env.EMAIL_PORT || 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });
};

/**
 * Sends a response email to the user who submitted an inquiry.
 * @param {object} inquiryData - Contains name, email, and subject of the original inquiry.
 * @param {string} responseMessage - The staff member's response message.
 * @param {string} handlerName - The name of the staff member responding.
 * @returns {Promise<{success: boolean, messageId?: string, message?: string, error?: string}>}
 */
export const sendInquiryResponse = async (inquiryData, responseMessage, handlerName) => {
  try {
    const transporter = createTransporter();

    // Check transporter readiness (optional but recommended for debugging)
    await transporter.verify();
    
    const mailOptions = {
      from: {
        name: 'Apang Seva Kendra',
        address: process.env.EMAIL_USER
      },
      to: inquiryData.email,
      subject: `Re: ${inquiryData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .response-box {
              background: white;
              padding: 20px;
              border-left: 4px solid #2563eb;
              margin: 20px 0;
              border-radius: 5px;
            }
            .footer {
              background: #1f2937;
              color: #9ca3af;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              border-radius: 0 0 10px 10px;
            }
            .greeting {
              color: #1f2937;
              margin-bottom: 15px;
            }
            .signature {
              margin-top: 20px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Apang Seva Kendra</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Response to Your Inquiry</p>
            </div>
            
            <div class="content">
              <p class="greeting">Dear ${inquiryData.name},</p>
              
              <p>Thank you for contacting Apang Seva Kendra. We have received your inquiry regarding "<strong>${inquiryData.subject}</strong>" and here is our response:</p>
              
              <div class="response-box">
                <p style="margin: 0; white-space: pre-wrap;">${responseMessage}</p>
              </div>
              
              <p>If you have any further questions or need additional assistance, please don't hesitate to reach out to us.</p>
              
              <div class="signature">
                <p style="margin: 5px 0;"><strong>Best regards,</strong></p>
                <p style="margin: 5px 0;">${handlerName || 'Support Team'}</p>
                <p style="margin: 5px 0;">Apang Seva Kendra</p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 5px 0;">This is an automated response to your inquiry.</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Apang Seva Kendra. All rights reserved.</p>
              <p style="margin: 5px 0;">
                <strong>Contact:</strong> ${process.env.EMAIL_USER} | 
                <strong>Phone:</strong> ${inquiryData.phone || 'N/A'}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
Dear ${inquiryData.name},

Thank you for contacting Apang Seva Kendra. We have received your inquiry regarding "${inquiryData.subject}" and here is our response:

${responseMessage}

If you have any further questions or need additional assistance, please don't hesitate to reach out to us.

Best regards,
${handlerName || 'Support Team'}
Apang Seva Kendra

---
This is an automated response to your inquiry.
© ${new Date().getFullYear()} Apang Seva Kendra. All rights reserved.
Contact: ${process.env.EMAIL_USER}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
};

/**
 * Sends a confirmation email to the user when they submit a new inquiry.
 * @param {object} inquiryData - Contains name, email, subject, and phone of the original inquiry.
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export const sendInquiryConfirmation = async (inquiryData) => {
  try {
    const transporter = createTransporter();

    // Check transporter readiness (optional but recommended for debugging)
    await transporter.verify();

    const mailOptions = {
      from: {
        name: 'Apang Seva Kendra',
        address: process.env.EMAIL_USER
      },
      to: inquiryData.email,
      subject: 'We received your inquiry - Apang Seva Kendra',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .info-box {
              background: white;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
              border: 1px solid #e5e7eb;
            }
            .footer {
              background: #1f2937;
              color: #9ca3af;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              border-radius: 0 0 10px 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your inquiry has been received</p>
            </div>
            
            <div class="content">
              <p>Dear ${inquiryData.name},</p>
              
              <p>Thank you for contacting <strong>Apang Seva Kendra</strong>. We have successfully received your inquiry and our team will review it shortly.</p>
              
              <div class="info-box">
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${inquiryData.subject}</p>
                <p style="margin: 5px 0;"><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p>You will receive a response from our team within <strong>24-48 hours</strong>.</p>
              
              <p>If you have any urgent concerns, please feel free to call us directly.</p>
            </div>
            
            <div class="footer">
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Apang Seva Kendra. All rights reserved.</p>
              <p style="margin: 5px 0;">
                <strong>Email:</strong> ${process.env.EMAIL_USER} | 
                <strong>Phone:</strong> +91-XXXXXXXXXX
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${inquiryData.name},

Thank you for contacting Apang Seva Kendra. We have successfully received your inquiry and our team will review it shortly.

Subject: ${inquiryData.subject}
Submitted on: ${new Date().toLocaleString()}

You will receive a response from our team within 24-48 hours.

If you have any urgent concerns, please feel free to call us directly.

Best regards,
Apang Seva Kendra Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Confirmation email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
