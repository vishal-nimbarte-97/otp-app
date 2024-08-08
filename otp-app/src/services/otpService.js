const OTP = require('../models/otp');
const crypto = require('crypto');

const generateOTP = () => crypto.randomBytes(3).toString('hex');

const saveOTP = async (email) => {
  // Remove existing OTPs for this email
  await OTP.destroy({ where: { email } });

  // Generate a new OTP
  const otp = generateOTP();
  const expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

  // Save the new OTP
  await OTP.create({ email, otp, expires_at });

  return otp;
};

const verifyOTP = async (email, otp) => {
    
  const record = await OTP.findOne({ where: { email, otp } });
  if (record && record.expires_at > new Date()) {
    await OTP.destroy({ where: { id: record.id } }); // Remove OTP after use
    return true;
  }
  return false;
};

module.exports = { saveOTP, verifyOTP };
