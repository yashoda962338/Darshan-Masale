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

    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
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
 * IMPORTANT: All critical styling is INLINE (not in a <style> block).
 * Gmail's mobile app, Outlook, and several webmail clients strip or
 * partially ignore <style> blocks, which was causing the OTP box /
 * colors to disappear for real recipients even though sendMail()
 * succeeded. Inline styles + bgcolor attributes render reliably
 * everywhere. We also declare color-scheme so Gmail/Outlook dark
 * mode does not auto-invert the light box and swallow the text.
 * @param {string} bodyContent - Inner HTML content (must use inline styles)
 * @returns {string}
 */
const buildBaseTemplate = (bodyContent) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Darshan Masale</title>
  </head>
  <body style="margin:0; padding:0; background-color:#FDF8F0; -webkit-text-size-adjust:100%; text-size-adjust:100%;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FDF8F0" style="background-color:#FDF8F0; padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="width:580px; max-width:580px; background-color:#FFFFFF; border-radius:24px; border:1px solid #F0E4C8;">
            <tr>
              <td style="padding:40px 40px 24px 40px; text-align:center; border-bottom:2px solid #F5EDE0;">
                <div style="font-family:Georgia, 'Playfair Display', serif; font-size:32px; font-weight:700; color:#7B1F2B;">
                  Darshan <span style="color:#C9A84C;">Masale</span>
                </div>
                <div style="color:#7A7A7A; font-size:14px; margin-top:4px; font-family:Arial, Helvetica, sans-serif;">
                  Premium Indian Spices &bull; Since 1995
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 40px 10px 40px; font-family:Arial, Helvetica, sans-serif;">
                ${bodyContent}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px 32px 40px; text-align:center; color:#7A7A7A; font-size:12px; font-family:Arial, Helvetica, sans-serif;">
                <p style="margin:0;">© ${new Date().getFullYear()} Darshan Masale. All rights reserved.</p>
                <p style="margin:4px 0 0 0;">Nandurbar, Maharashtra, India</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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
          <div style="font-size:16px; color:#1C1C1C; margin-bottom:12px;">${greeting}</div>
          <div style="font-size:15px; color:#3D3D3D; line-height:1.6; margin-bottom:24px;">${introMessage}</div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F5EDE0" style="background-color:#F5EDE0; border-radius:16px; border:1px solid #E8D9AE; margin:24px 0;">
            <tr>
              <td align="center" style="padding:28px 20px;">
                <div style="font-size:44px; font-weight:700; color:#7B1F2B; letter-spacing:10px; font-family:'Courier New', Courier, monospace;">
                  ${otp}
                </div>
                <div style="color:#7A7A7A; font-size:13px; margin-top:10px; font-family:Arial, Helvetica, sans-serif;">
                  &#9200; This code expires in <strong>5 minutes</strong>
                </div>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFF8F0" style="background-color:#FFF8F0; border-left:3px solid #C9A84C; margin-top:16px;">
            <tr>
              <td style="padding:12px 16px; font-size:13px; color:#7A7A7A;">
                &#128274; For security, never share this OTP with anyone. ${ignoreMessage}
              </td>
            </tr>
          </table>

          <div style="border-top:1px solid #F5EDE0; margin:24px 0;"></div>

          <div style="text-align:center; font-size:13px; color:#7A7A7A;">
            Need help? Contact us at <a href="mailto:support@darshanmasale.com" style="color:#C9A84C; text-decoration:none;">support@darshanmasale.com</a>
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
          <div style="font-size:18px; color:#1E7E34; font-weight:600; margin-bottom:12px;">
            Payment Successful &#9989;
          </div>
          <div style="font-size:15px; color:#3D3D3D; line-height:1.6; margin-bottom:24px;">
            Thank you for shopping with Darshan Masale. Your order has been confirmed and we will start processing it shortly.
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:16px 0;">
            <tr>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#7A7A7A; font-weight:500; font-size:15px;">Order Number</td>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#3D3D3D; font-size:15px;">${order.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#7A7A7A; font-weight:500; font-size:15px;">Total Amount</td>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#3D3D3D; font-size:15px;">₹${order.total}</td>
            </tr>
            <tr>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#7A7A7A; font-weight:500; font-size:15px;">Payment Status</td>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#1E7E34; font-weight:600; font-size:15px;">${order.paymentStatus}</td>
            </tr>
            <tr>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#7A7A7A; font-weight:500; font-size:15px;">Order Status</td>
              <td style="padding:10px 4px; border-bottom:1px solid #F5EDE0; color:#3D3D3D; font-size:15px;">${order.status}</td>
            </tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px auto 12px auto;">
            <tr>
              <td bgcolor="#7B1F2B" style="background-color:#7B1F2B; border-radius:30px;">
                <a href="${CUSTOMER_ORDERS_URL}" style="display:inline-block; padding:12px 32px; color:#FFFFFF; text-decoration:none; font-weight:500; font-size:14px; font-family:Arial, Helvetica, sans-serif;">View My Orders</a>
              </td>
            </tr>
          </table>

          <div style="border-top:1px solid #F5EDE0; margin:24px 0;"></div>

          <div style="text-align:center; font-size:13px; color:#7A7A7A;">
            Need help? Contact us at <a href="mailto:support@darshanmasale.com" style="color:#C9A84C; text-decoration:none;">support@darshanmasale.com</a>
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