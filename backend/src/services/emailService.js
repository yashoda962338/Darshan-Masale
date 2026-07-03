// backend/src/services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/environment');
const logger = require('../config/logger');

const CUSTOMER_ORDERS_URL = 'https://darshanmasale.pages.dev/customer/orders';

// ============================================================
// TRANSPORTER SETUP
// ============================================================

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,

    auth: {
        user: config.email.user,
        pass: config.email.password,
    },

    tls: {
        rejectUnauthorized: false,
    },
    requireTLS: true,

    connectionTimeout: 120000,
    greetingTimeout: 120000,
    socketTimeout: 120000,
});

logger.info('========== EMAIL CONFIG ==========');
logger.info(
    JSON.stringify({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        user: config.email.user,
        pass: config.email.password ? 'Loaded ✅' : 'Missing ❌',
    })
);
logger.info('===================================');

transporter.verify((error) => {
    if (error) {
        logger.error('❌ SMTP VERIFY FAILED');
        logger.error(error.message);
        if (error.stack) {
            logger.error(error.stack);
        }
    } else {
        logger.info('✅ SMTP Connected Successfully');
    }
});

// ============================================================
// HTML TEMPLATE HELPERS
// ============================================================

/**
 * Shared base wrapper for all outgoing emails.
 * @param {string} bodyContent - Inner HTML content
 * @returns {string}
 */
const buildBaseTemplate = (bodyContent) => `
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
      table.order-table {
        width: 100%;
        font-size: 15px;
        border-collapse: collapse;
        margin: 16px 0;
      }
      table.order-table td {
        padding: 10px 4px;
        border-bottom: 1px solid #F5EDE0;
        color: #3D3D3D;
      }
      table.order-table td:first-child {
        color: #7A7A7A;
        font-weight: 500;
      }
      .status-success {
        color: #1E7E34;
        font-weight: 600;
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
        ${bodyContent}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Darshan Masale. All rights reserved.</p>
        <p style="margin-top: 4px;">Nandurbar, Maharashtra, India</p>
      </div>
    </div>
  </body>
  </html>
`;

// ============================================================
// CORE EMAIL SENDER
// ============================================================

/**
 * Generic reusable email sender.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} [text] - Plain text fallback
 * @returns {Promise<boolean>}
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

        await transporter.sendMail(mailOptions);
        logger.info(`📧 Email sent to ${to} — "${subject}"`);
        return true;
    } catch (error) {
        logger.error(`❌ Email send error (to: ${to}, subject: ${subject}): ${error.message}`);
        if (error.stack) {
            logger.error(error.stack);
        }
        return false;
    }
};

// ============================================================
// OTP EMAIL
// ============================================================

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

        const introMessage = purpose === 'REGISTRATION'
            ? 'Thank you for choosing Darshan Masale. Please use the verification code below to complete your account registration.'
            : 'We received a request to reset your password. Use the verification code below to proceed.';

        const ignoreMessage = purpose === 'REGISTRATION'
            ? "If you didn't register, please ignore this email."
            : "If you didn't request this, please ignore this email.";

        const bodyContent = `
          <div class="greeting">${greeting}</div>
          <div class="message">${introMessage}</div>

          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">⏱️ This code expires in <strong>5 minutes</strong></div>
          </div>

          <div class="security-note">
            🔒 For security, never share this OTP with anyone. ${ignoreMessage}
          </div>

          <div class="divider"></div>

          <div style="text-align: center; font-size: 13px; color: #7A7A7A;">
            Need help? Contact us at <a href="mailto:support@darshanmasale.com">support@darshanmasale.com</a>
          </div>
        `;

        const html = buildBaseTemplate(bodyContent);

        const text = `
Darshan Masale - ${subject}

${greeting}

${introMessage}

Your OTP: ${otp}

This OTP expires in 5 minutes.

For security, never share this OTP with anyone.

Need help? Contact us at support@darshanmasale.com

© ${new Date().getFullYear()} Darshan Masale. All rights reserved.
Nandurbar, Maharashtra, India
        `.trim();

        const mailOptions = {
            from: `"Darshan Masale" <${config.email.user}>`,
            to: email,
            subject,
            html,
            text,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'X-Mailer': 'Darshan Masale OTP Service',
            },
        };

        await transporter.sendMail(mailOptions);
        logger.info(`📧 OTP email sent to ${email} (${purpose})`);
        return true;
    } catch (error) {
        logger.error(`❌ OTP email send error (to: ${email}, purpose: ${purpose}): ${error.message}`);
        if (error.stack) {
            logger.error(error.stack);
        }
        return false;
    }
};

// ============================================================
// ORDER SUCCESS EMAIL
// ============================================================

/**
 * Send order confirmation / payment success email.
 * @param {string} email - Recipient email
 * @param {object} order - Order details { orderNumber, total, paymentStatus, status }
 * @returns {Promise<boolean>}
 */
const sendOrderSuccessEmail = async (email, order) => {
    try {
        const subject = `Order Confirmed - ${order.orderNumber}`;

        const bodyContent = `
          <div class="greeting" style="font-size:18px; color:#1E7E34; font-weight:600;">
            Payment Successful ✅
          </div>
          <div class="message">
            Thank you for shopping with Darshan Masale. Your order has been confirmed and we will start processing it shortly.
          </div>

          <table class="order-table">
            <tr>
              <td>Order Number</td>
              <td>${order.orderNumber}</td>
            </tr>
            <tr>
              <td>Total Amount</td>
              <td>₹${order.total}</td>
            </tr>
            <tr>
              <td>Payment Status</td>
              <td class="status-success">${order.paymentStatus}</td>
            </tr>
            <tr>
              <td>Order Status</td>
              <td>${order.status}</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 28px 0 12px;">
            <a href="${CUSTOMER_ORDERS_URL}" class="button">View My Orders</a>
          </div>

          <div class="divider"></div>

          <div style="text-align: center; font-size: 13px; color: #7A7A7A;">
            Need help? Contact us at <a href="mailto:support@darshanmasale.com">support@darshanmasale.com</a>
          </div>
        `;

        const html = buildBaseTemplate(bodyContent);

        const text = `
Darshan Masale - ${subject}

Payment Successful ✅

Thank you for shopping with Darshan Masale. Your order has been confirmed and we will start processing it shortly.

Order Number: ${order.orderNumber}
Total Amount: ₹${order.total}
Payment Status: ${order.paymentStatus}
Order Status: ${order.status}

View your orders: ${CUSTOMER_ORDERS_URL}

Need help? Contact us at support@darshanmasale.com

© ${new Date().getFullYear()} Darshan Masale. All rights reserved.
Nandurbar, Maharashtra, India
        `.trim();

        return await sendEmail(email, subject, html, text);
    } catch (error) {
        logger.error(`❌ Order success email error (to: ${email}, order: ${order && order.orderNumber}): ${error.message}`);
        if (error.stack) {
            logger.error(error.stack);
        }
        return false;
    }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    sendOTPEmail,
    sendEmail,
    sendOrderSuccessEmail,
};