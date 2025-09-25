const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, Employee } = require('../models'); // Sequelize models

// =======================
// Register
// =======================
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword, mobile });

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

// =======================
// Check if email exists
// =======================
exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existingUser = await User.findOne({ where: { email } });
    res.json({ exists: !!existingUser });
  } catch (error) {
    next(error);
  }
};

// =======================
// Login
// =======================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const employee = await Employee.findOne({ where: { registered_email: email } });
    if (!employee) return res.status(400).json({ message: 'No employee record found' });
    if (employee.activeYN !== 'Y') {
      return res.status(403).json({ message: 'This user is not active, please contact admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// =======================
// Send OTP
// =======================
exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedOTP = await bcrypt.hash(otp, 10);

    await user.update({ otp: hashedOTP, otp_expiry: otpExpiry });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">Use the following code to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #4CAF50; color: white; padding: 14px 24px; font-size: 24px; letter-spacing: 4px; border-radius: 6px; font-weight: bold;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">This code will expire in 10 minutes.</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// =======================
// Verify OTP
// =======================
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.otp || user.otp_expiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    const match = await bcrypt.compare(otp, user.otp);
    if (!match) return res.status(400).json({ message: 'Invalid OTP' });

    res.json({ message: 'OTP verified' });
  } catch (error) {
    next(error);
  }
};

// =======================
// Reset Password
// =======================
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.otp || user.otp_expiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    const match = await bcrypt.compare(otp, user.otp);
    if (!match) return res.status(400).json({ message: 'Invalid OTP' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword, otp: null, otp_expiry: null });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// =======================
// Token Validation
// =======================
exports.tokenValidation = (req, res) => {
  console.log('Token validation hit');
  console.log(req.user);
  res.json({ message: 'Token verified' });
};
