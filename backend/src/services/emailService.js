// backend/src/services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/environment');
const logger = require('../config/logger');

// Create transporter
// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },

    tls: {
        rejectUnauthorized: false,
    },

    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,

    logger: true,
    debug: true,
});

// Verify transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ SMTP VERIFY FAILED");
        console.log(error);

        logger.error(error.message);
    } else {
        console.log("✅ SMTP Connected Successfully");
        logger.info("✅ Email service ready");
    }
});

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} purpose - 'REGISTRATION' | 'FORGOT_PASSWORD'
 * @param {string} name - User's first name (optional)
 * @returns {Promise<boolean>}
 */
const sendOTPEmail = async (email, otp, purpose = 'REGISTRATION', name = '') => {
    try {
        const subject = purpose === 'REGISTRATION'
            ? 'Verify Your Darshan Masale Account'
            : 'Reset Your Darshan Masale Password';

        const greeting = name ? `Hello ${name},` : 'Hello,';

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
            background-color: #FDF8F0; 
            margin: 0;
            padding: 40px 20px;
          }
          .container { 
            max-width: 580px; 
            margin: 0 auto; 
            padding: 40px; 
            background: #FFFFFF; 
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(123, 31, 43, 0.08);
            border: 1px solid rgba(201, 168, 76, 0.1);
          }
          .header { 
            text-align: center; 
            padding-bottom: 24px; 
            border-bottom: 2px solid #F5EDE0;
          }
          .logo { 
            font-family: 'Playfair Display', serif;
            font-size: 32px; 
            font-weight: 700; 
            color: #7B1F2B;
          }
          .gold { 
            color: #C9A84C; 
          }
          .subtitle {
            color: #7A7A7A;
            font-size: 14px;
            margin-top: 4px;
          }
          .content {
            padding: 30px 0 20px;
          }
          .greeting {
            font-size: 16px;
            color: #1C1C1C;
            margin-bottom: 12px;
          }
          .message {
            font-size: 15px;
            color: #3D3D3D;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .otp-box { 
            background: linear-gradient(135deg, #FDF8F0 0%, #F5EDE0 100%);
            padding: 28px 20px; 
            border-radius: 16px; 
            text-align: center; 
            margin: 24px 0;
            border: 1px solid rgba(201, 168, 76, 0.15);
          }
          .otp-code { 
            font-size: 44px; 
            font-weight: 700; 
            color: #7B1F2B; 
            letter-spacing: 10px;
            font-family: 'Courier New', monospace;
          }
          .otp-expiry {
            color: #7A7A7A; 
            font-size: 13px; 
            margin-top: 10px;
          }
          .divider {
            border-top: 1px solid #F5EDE0;
            margin: 24px 0;
          }
          .footer { 
            text-align: center; 
            color: #7A7A7A; 
            font-size: 12px; 
            padding-top: 20px;
          }
          .footer a {
            color: #C9A84C;
            text-decoration: none;
          }
          .security-note {
            background: #FFF8F0;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            color: #7A7A7A;
            border-left: 3px solid #C9A84C;
            margin-top: 16px;
          }
          .button {
            display: inline-block;
            padding: 12px 32px;
            background: #7B1F2B;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 500;
            font-size: 14px;
          }
          @media (max-width: 480px) {
            .container { padding: 24px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; }
            .logo { font-size: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Darshan <span class="gold">Masale</span></div>
            <div class="subtitle">Premium Indian Spices • Since 1995</div>
          </div>
          
          <div class="content">
            <div class="greeting">${greeting}</div>
            
            <div class="message">
              ${purpose === 'REGISTRATION'
                ? 'Thank you for choosing Darshan Masale. Please use the verification code below to complete your account registration.'
                : 'We received a request to reset your password. Use the verification code below to proceed.'}
            </div>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="otp-expiry">⏱️ This code expires in <strong>5 minutes</strong></div>
            </div>
            
            <div class="security-note">
              🔒 For security, never share this OTP with anyone. 
              ${purpose === 'REGISTRATION' ? 'If you didn\'t register, please ignore this email.' : 'If you didn\'t request this, please ignore this email.'}
            </div>
            
            <div class="divider"></div>
            
            <div style="text-align: center; font-size: 13px; color: #7A7A7A;">
              Need help? Contact us at <a href="mailto:support@darshanmasale.com">support@darshanmasale.com</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2026 Darshan Masale. All rights reserved.</p>
            <p style="margin-top: 4px;">Nandurbar, Maharashtra, India</p>
            <p style="margin-top: 8px; font-size: 11px; color: #B0B0B0;">
              This email was sent to ${email}. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        const text = `
      Darshan Masale - ${subject}
      
      ${greeting}
      
      ${purpose === 'REGISTRATION'
                ? 'Thank you for choosing Darshan Masale. Please use the verification code below to complete your account registration.'
                : 'We received a request to reset your password. Use the verification code below to proceed.'}
      
      Your OTP: ${otp}
      
      This OTP expires in 5 minutes.
      
      For security, never share this OTP with anyone.
      
      Need help? Contact us at support@darshanmasale.com
      
      © 2026 Darshan Masale. All rights reserved.
      Nandurbar, Maharashtra, India
    `;

        const sendOrderSuccessEmail = async (email, order) => {

            const html = `

  <div style="font-family:Arial;padding:30px;background:#f5f5f5">

    <div style="max-width:650px;margin:auto;background:#fff;padding:30px;border-radius:10px">

      <h1 style="color:#7B1F2B">

        Darshan Masale

      </h1>

      <h2 style="color:green">

        Payment Successful ✅

      </h2>

      <p>

        Thank you for shopping with Darshan Masale.

      </p>

      <hr>

      <table style="width:100%;font-size:16px">

        <tr>

          <td><b>Order Number</b></td>

          <td>${order.orderNumber}</td>

        </tr>

        <tr>

          <td><b>Total Amount</b></td>

          <td>₹${order.total}</td>

        </tr>

        <tr>

          <td><b>Payment Status</b></td>

          <td>${order.paymentStatus}</td>

        </tr>

        <tr>

          <td><b>Order Status</b></td>

          <td>${order.status}</td>

        </tr>

      </table>

      <br>

      <p>

        Your order has been confirmed and we will start processing it shortly.

      </p>

      <br>

      <a
      href="http://localhost:3000/customer/orders"
      style="background:#7B1F2B;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px">

      View My Orders

      </a>

      <br><br>

      Regards,

      <br>

      <b>Darshan Masale Team</b>

    </div>

  </div>

  `;

            return await sendEmail(

                email,

                `Order Confirmed - ${order.orderNumber}`,

                html

            );

        };
        const mailOptions = {
            from: `"Darshan Masale" <${config.email.user}>`,
            to: email,
            subject: subject,
            html: html,
            text: text,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'X-Mailer': 'Darshan Masale OTP Service',
            },
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`📧 OTP email sent to ${email} (${purpose})`);
        return true;
    } catch (error) {
        logger.error('Email send error:', error.message);
        logger.error('Stack:', error.stack);
        return false;
    }
};

/**
 * Send general email (for future use)
 */
const sendEmail = async (to, subject, html, text = '') => {
    try {
        const mailOptions = {
            from: `"Darshan Masale" <${config.email.user}>`,
            to,
            subject,
            html,
            text,
        };
        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        logger.error('Email send error:', error.message);
        return false;
    }
};

module.exports = {
    sendOTPEmail,
    sendEmail,
    sendOrderSuccessEmail
};