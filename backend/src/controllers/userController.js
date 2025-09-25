const { User } = require('../models');

// =======================
// Get all users
// =======================
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    next(err);
  }
};

// =======================
// Get user by ID
// =======================
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error fetching user:', err);
    next(err);
  }
};

// =======================
// Create a new user
// =======================
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Check for existing email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, mobile });
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    console.error('Error creating user:', err);
    next(err);
  }
};

// =======================
// Update user password
// =======================
exports.updateUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = password;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    next(err);
  }
};

// =======================
// Update OTP
// =======================
exports.updateUserOTP = async (req, res, next) => {
  try {
    const { email, otp, otp_expiry } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.otp = otp;
    user.otp_expiry = otp_expiry;
    await user.save();

    res.json({ success: true, message: 'OTP updated successfully' });
  } catch (err) {
    console.error('Error updating OTP:', err);
    next(err);
  }
};

// =======================
// Clear OTP
// =======================
exports.clearUserOTP = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    res.json({ success: true, message: 'OTP cleared successfully' });
  } catch (err) {
    console.error('Error clearing OTP:', err);
    next(err);
  }
};
