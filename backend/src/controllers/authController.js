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
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must include uppercase, lowercase, number, and special character.',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
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
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await user.save();

    // Generate verification token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/verify/${token}`;
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
    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
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
      return res
        .status(403)
        .json({ error: 'Please verify your email before logging in.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`Login attempt with wrong password for email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    logger.info(`User logged in: ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isDefaultPassword: user.isDefaultPassword,
      },
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    const fetchedUsers = await User.find({}, '-password');
    const users = fetchedUsers.filter(
      (user) => user._id.toString() !== req.user.userId
    );

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
    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      select: '-password',
    });
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
    if (!['user', 'admin'].includes(role))
      return res.status(400).json({ error: 'Invalid role.' });
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change password (for users with default passwords)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user and include password for verification
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // Check if new password meets requirements
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      isDefaultPassword: false,
    });

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    logger.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
};

// Send invitation email to user (admin only)
exports.sendInvitationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified.' });
    }

    // Generate a new temporary password
    const systemGeneratedPassword = `${
      user.firstName.length <= 3
        ? user.firstName +
          Array.from({ length: 3 - user.firstName.length }, () => 'a').join('')
        : user.firstName.substring(0, 3)
    }${
      user.lastName.length <= 3
        ? user.lastName +
          Array.from({ length: 3 - user.lastName.length }, () => 'a').join('')
        : user.lastName.substring(0, 3)
    }${Date.now()}!`;

    // Update user with new password and reset flags
    await User.findByIdAndUpdate(id, {
      password: await bcrypt.hash(systemGeneratedPassword, 10),
      isDefaultPassword: true,
    });

    // Send invitation email with new credentials
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to Golden Basket Mart - Your Account Has Been Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a3824c;">Welcome to Golden Basket Mart!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your account has been created by an administrator. You can now log in to Golden Basket Mart using the credentials below:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #a3824c; margin-top: 0;">Your Login Details:</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Temporary Password:</strong> ${systemGeneratedPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          <a href="${process.env.CORS_ORIGIN}/login" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Login Now</a>
          <p>Best regards,<br>Golden Basket Mart Team</p>
        </div>
      `,
    });

    logger.info(`Invitation email sent to user by admin ${req.user.id}: ${user.email}`);
    res.json({ message: 'Invitation email sent successfully.' });
  } catch (err) {
    logger.error('Send invitation email error:', err);
    res.status(500).json({ error: 'Failed to send invitation email.' });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const inviterId = req.user.id; // Get the admin who is creating the user
    
    const systemGeneratedPassword = `${
      firstName.length <= 3
        ? firstName +
          Array.from({ length: 3 - firstName.length }, () => 'a').join('')
        : firstName.substring(0, 3)
    }${
      lastName.length <= 3
        ? lastName +
          Array.from({ length: 3 - lastName.length }, () => 'a').join('')
        : lastName.substring(0, 3)
    }${Date.now()}!`;

    const user = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(systemGeneratedPassword, 10),
      role: 'user',
      isVerified: false,
      isDefaultPassword: true,
      inviter: inviterId,
    });
    await user.save();

    // Send invitation email with login credentials
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Welcome to Golden Basket Mart - Your Account Has Been Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a3824c;">Welcome to Golden Basket Mart!</h2>
          <p>Hi ${firstName},</p>
          <p>Your account has been created by an administrator. You can now log in to Golden Basket Mart using the credentials below:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #a3824c; margin-top: 0;">Your Login Details:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${systemGeneratedPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          <a href="${process.env.CORS_ORIGIN}/login" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Login Now</a>
          <p>Best regards,<br>Golden Basket Mart Team</p>
        </div>
      `,
    });

    logger.info(`New user created by admin ${inviterId}: ${email}`);
    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    logger.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    logger.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

    // Validation
    if (firstName && (firstName.length < 2 || firstName.length > 50)) {
      return res.status(400).json({ error: 'First name must be between 2 and 50 characters.' });
    }

    if (lastName && (lastName.length < 2 || lastName.length > 50)) {
      return res.status(400).json({ error: 'Last name must be between 2 and 50 characters.' });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    logger.info(`Profile updated for user: ${updatedUser.email}`);
    res.json(updatedUser);
  } catch (err) {
    logger.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};
