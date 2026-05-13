const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Reset password email
function sendResetEmail(toEmail, resetLink) {
  return transporter.sendMail({
    from: `"Campaign Tracker" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your Password - Campaign Tracker",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; color: #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #4f46e5, #06b6d4); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: white;">CT</div>
          <h1 style="font-size: 22px; font-weight: 800; margin-top: 16px; color: #f1f5f9;">Reset Your Password</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">You requested a password reset for your Campaign Tracker account.</p>
        </div>
        <a href="${resetLink}" style="display: block; text-align: center; background: linear-gradient(135deg, #4f46e5, #3730a3); color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
          Reset My Password
        </a>
        <p style="color: #94a3b8; font-size: 13px; text-align: center;">This link expires in <strong style="color: #f1f5f9;">1 hour</strong>. If you didn't request this, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid rgba(148,163,184,0.15); margin: 24px 0;">
        <p style="color: #64748b; font-size: 12px; text-align: center;">Campaign Tracker · Sent automatically</p>
      </div>
    `
  });
}

// Conversion notification email
function sendConversionEmail(toEmail, userName, campaignName, conversionType, revenue) {
  return transporter.sendMail({
    from: `"Campaign Tracker" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎉 New Conversion on "${campaignName}" - Campaign Tracker`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; color: #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #4f46e5, #06b6d4); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: white;">CT</div>
          <h1 style="font-size: 22px; font-weight: 800; margin-top: 16px; color: #f1f5f9;">New Conversion! 🎉</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Hi ${userName}, your campaign just got a new conversion!</p>
        </div>

        <div style="background: rgba(79,70,229,0.15); border: 1px solid rgba(79,70,229,0.3); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Campaign</div>
            <div style="font-size: 16px; font-weight: 700; color: #f1f5f9;">${campaignName}</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Conversion Type</div>
            <div style="font-size: 16px; font-weight: 700; color: #f1f5f9;">${conversionType}</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Revenue</div>
            <div style="font-size: 24px; font-weight: 800; color: #10b981;">₹${parseFloat(revenue).toFixed(2)}</div>
          </div>
        </div>

        <a href="https://web-production-ef9b1.up.railway.app/campaigntracker/dashboard.html" style="display: block; text-align: center; background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
          View Analytics
        </a>

        <hr style="border: none; border-top: 1px solid rgba(148,163,184,0.15); margin: 24px 0;">
        <p style="color: #64748b; font-size: 12px; text-align: center;">Campaign Tracker · Sent automatically</p>
      </div>
    `
  });
}

module.exports = { sendResetEmail, sendConversionEmail };