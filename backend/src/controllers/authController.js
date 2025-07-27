const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Joi = require('joi');
const logger = require('../utils/logger'); // Added logger import

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character.'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register user with email verification
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Create new user
    const user = new User({ firstName, lastName, email, password, isVerified: false });
    await user.save();
    
    // Generate verification token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${token}`;
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify your email - Golden Basket Mart',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a3824c;">Welcome to Golden Basket Mart!</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for registering with Golden Basket Mart. Please click the button below to verify your email address:</p>
          <a href="${verifyUrl}" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${verifyUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>Golden Basket Mart Team</p>
        </div>
      `,
    });

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    logger.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      logger.warn(`Email verification attempt with invalid token: ${token}`);
      return res.status(400).json({ error: 'Invalid token.' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified.' });
    }
    
    user.isVerified = true;
    await user.save();
    
    logger.info(`Email verified for user: ${user.email}`);
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    logger.error('Email verification error:', err);
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    
    if (!user.isVerified) {
      logger.warn(`Login attempt with unverified email: ${email}`);
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`Login attempt with wrong password for email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    logger.info(`User logged in: ${email}`);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName 
      } 
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}; 

// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.password) delete update.password; // Prevent password change here
    const user = await User.findByIdAndUpdate(id, update, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change user role (admin only)
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role.' });
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 