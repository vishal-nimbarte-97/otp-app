const OTPService = require('../services/otpService');
const sendEmail = require('../services/emailService');
const User = require('../models/user');

const registerUser = async (req, res) => {
  const { email } = req.body;
  try {
    await User.upsert({ email });
    res.json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

const requestOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = await OTPService.saveOTP(email);
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
                margin-bottom: 20px;
            }
            p {
                color: #555555;
                font-size: 16px;
                line-height: 1.5;
            }
            .otp-code {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
                padding: 10px;
                border: 2px solid #007bff;
                border-radius: 4px;
                display: inline-block;
                margin: 10px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your OTP Code</h1>
            <p>Your OTP code is: <span class="otp-code">${otp}</span></p>
            <p>This code will expire in 15 minutes.</p>
            <div class="footer">
                <p>If you did not request this OTP, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    
    `;
    await sendEmail(email, 'Your OTP Code', html);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const isValid = await OTPService.verifyOTP(email, otp);
  if (isValid) {
    res.json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
};

module.exports = { registerUser, requestOTP, verifyOTP };
