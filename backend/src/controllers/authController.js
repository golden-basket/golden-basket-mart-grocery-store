const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Joi = require('joi');
const logger = require('../utils/logger');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;
const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Email transporter with enhanced configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 14, // 14 emails per second
});

// Enhanced validation schemas
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

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
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

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must include uppercase, lowercase, number, and special character.',
    }),
});

// Helper function to get client IP
const getClientIP = (req) => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket?.remoteAddress ||
    'unknown'
  );
};

// Helper function to get user agent
const getUserAgent = (req) => {
  return req.get('User-Agent') || 'unknown';
};

// Helper function to send email
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}: ${subject}`);
    return result;
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Enhanced registration with email verification
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findByEmail(email);
    if (existing) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #a3824c; margin: 0;">Welcome to Golden Basket Mart!</h2>
          <p style="color: #7d6033; font-size: 16px;">Your fresh grocery journey starts here</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(163,130,76,0.1);">
          <h3 style="color: #a3824c; margin-top: 0;">Hi ${firstName},</h3>
          <p style="color: #2e3a1b; line-height: 1.6;">Thank you for registering with Golden Basket Mart! To complete your registration and start shopping for fresh groceries, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(163,130,76,0.3);">Verify Email Address</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #a3824c; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #a3824c;">
            <p style="margin: 0; color: #666; font-size: 14px;"><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7d6033; font-size: 14px;">
          <p>Best regards,<br><strong>Golden Basket Mart Team</strong></p>
          <p>Fresh groceries delivered to your doorstep</p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Verify your email - Golden Basket Mart', emailHtml);

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

// Enhanced email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn(`Email verification attempt with invalid/expired token`);
      return res
        .status(400)
        .json({ error: 'Invalid or expired verification token.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified.' });
    }

    // Verify email and clear token
    user.isVerified = true;
    user.clearEmailVerificationToken();
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);
    res.json({
      message: 'Email verified successfully. You can now log in.',
      redirectUrl: `${FRONTEND_URL}/login`,
    });
  } catch (err) {
    logger.error('Email verification error:', err);
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};

// Enhanced login with security features
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = getClientIP(req);
    const userAgent = getUserAgent(req);

    const user = await User.findByEmail(email);

    if (!user) {
      logger.warn(
        `Login attempt with non-existent email: ${email} from IP: ${clientIP}`
      );
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Check if account is locked
    if (user.isLocked) {
      logger.warn(
        `Login attempt for locked account: ${email} from IP: ${clientIP}`
      );
      return res.status(423).json({
        error:
          'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
        lockUntil: user.lockUntil,
      });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      logger.warn(
        `Login attempt for suspended account: ${email} from IP: ${clientIP}`
      );
      return res.status(403).json({
        error: 'Account is suspended. Please contact support for assistance.',
        reason: user.suspensionReason,
      });
    }

    // Check if account is active
    if (!user.isActive) {
      logger.warn(
        `Login attempt for inactive account: ${email} from IP: ${clientIP}`
      );
      return res
        .status(403)
        .json({ error: 'Account is inactive. Please contact support.' });
    }

    if (!user.isVerified) {
      logger.warn(
        `Login attempt with unverified email: ${email} from IP: ${clientIP}`
      );
      return res
        .status(403)
        .json({ error: 'Please verify your email before logging in.' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      await user.addFailedLoginAttempt(clientIP, userAgent);

      logger.warn(
        `Failed login attempt for email: ${email} from IP: ${clientIP}`
      );
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login info
    user.lastLoginIp = clientIP;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`User logged in successfully: ${email} from IP: ${clientIP}`);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        isDefaultPassword: user.isDefaultPassword,
        profileCompleted: user.profileCompleted,
        lastLoginAt: user.lastLoginAt,
        accountStatus: user.accountStatus,
      },
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// Forgot password functionality
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const clientIP = getClientIP(req);

    const user = await User.findByEmail(email);

    // Don't reveal if email exists or not for security
    if (!user) {
      logger.warn(
        `Password reset attempt for non-existent email: ${email} from IP: ${clientIP}`
      );
      return res.json({
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    }

    if (!user.isVerified) {
      logger.warn(
        `Password reset attempt for unverified email: ${email} from IP: ${clientIP}`
      );
      return res.json({
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #a3824c; margin: 0;">Password Reset Request</h2>
          <p style="color: #7d6033; font-size: 16px;">Golden Basket Mart</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(163,130,76,0.1);">
          <h3 style="color: #a3824c; margin-top: 0;">Hi ${user.firstName},</h3>
          <p style="color: #2e3a1b; line-height: 1.6;">We received a request to reset your password for your Golden Basket Mart account. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(163,130,76,0.3);">Reset Password</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #a3824c; font-size: 14px; word-break: break-all;">${resetUrl}</p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;"><strong>Security Notice:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #856404; font-size: 14px;">
              <li>This link will expire in 10 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will only be changed if you click the link above</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7d6033; font-size: 14px;">
          <p>Best regards,<br><strong>Golden Basket Mart Team</strong></p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      'Reset Your Password - Golden Basket Mart',
      emailHtml
    );

    logger.info(`Password reset email sent to: ${email} from IP: ${clientIP}`);
    res.json({
      message:
        'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    logger.error('Forgot password error:', err);
    res
      .status(500)
      .json({ error: 'Failed to process password reset request.' });
  }
};

// Reset password functionality
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn(`Password reset attempt with invalid/expired token`);
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    // Update password and clear reset token
    user.password = password;
    user.clearPasswordResetToken();
    user.isDefaultPassword = false;
    await user.save();

    logger.info(`Password reset successful for user: ${user.email}`);
    res.json({
      message:
        'Password has been reset successfully. You can now log in with your new password.',
      redirectUrl: `${FRONTEND_URL}/login`,
    });
  } catch (err) {
    logger.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

// Enhanced change password functionality
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    const clientIP = getClientIP(req);

    // Find user and include password for verification
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      logger.warn(
        `Failed password change attempt for user: ${user.email} from IP: ${clientIP}`
      );
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // Check if new password is different from current
    const isNewPasswordSame = await user.comparePassword(newPassword);
    if (isNewPasswordSame) {
      return res
        .status(400)
        .json({
          error: 'New password must be different from current password.',
        });
    }

    // Update password
    user.password = newPassword;
    user.isDefaultPassword = false;
    await user.save();

    logger.info(
      `Password changed successfully for user: ${user.email} from IP: ${clientIP}`
    );
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    logger.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
};

// Resend email verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const clientIP = getClientIP(req);

    const user = await User.findByEmail(email);

    if (!user) {
      logger.warn(
        `Verification resend attempt for non-existent email: ${email} from IP: ${clientIP}`
      );
      return res.json({
        message:
          'If an account with that email exists, a verification email has been sent.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified.' });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #a3824c; margin: 0;">Email Verification</h2>
          <p style="color: #7d6033; font-size: 16px;">Golden Basket Mart</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(163,130,76,0.1);">
          <h3 style="color: #a3824c; margin-top: 0;">Hi ${user.firstName},</h3>
          <p style="color: #2e3a1b; line-height: 1.6;">You requested a new email verification link. Please click the button below to verify your email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(163,130,76,0.3);">Verify Email Address</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #a3824c; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #a3824c;">
            <p style="margin: 0; color: #666; font-size: 14px;"><strong>Note:</strong> This verification link will expire in 24 hours.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7d6033; font-size: 14px;">
          <p>Best regards,<br><strong>Golden Basket Mart Team</strong></p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Verify your email - Golden Basket Mart', emailHtml);

    logger.info(`Verification email resent to: ${email} from IP: ${clientIP}`);
    res.json({
      message:
        'If an account with that email exists, a verification email has been sent.',
    });
  } catch (err) {
    logger.error('Resend verification error:', err);
    res.status(500).json({ error: 'Failed to resend verification email.' });
  }
};

// Get user profile with enhanced data
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

// Update user profile with enhanced validation
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      firstName,
      lastName,
      phone,
      emailNotifications,
      marketingEmails,
      language,
      timezone,
    } = req.body;

    // Validation
    if (firstName && (firstName.length < 2 || firstName.length > 50)) {
      return res
        .status(400)
        .json({ error: 'First name must be between 2 and 50 characters.' });
    }

    if (lastName && (lastName.length < 2 || lastName.length > 50)) {
      return res
        .status(400)
        .json({ error: 'Last name must be between 2 and 50 characters.' });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phone,
        emailNotifications,
        marketingEmails,
        language,
        timezone,
      },
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

// Logout functionality (client-side token removal)
exports.logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just return a success message
    logger.info(`User logged out: ${req.user.email}`);
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    logger.error('Logout error:', err);
    res.status(500).json({ error: 'Failed to logout.' });
  }
};

// Keep existing admin functions...
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
      password: await bcrypt.hash(systemGeneratedPassword, 12),
      isDefaultPassword: true,
    });

    // Send invitation email with new credentials
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #a3824c; margin: 0;">Welcome to Golden Basket Mart!</h2>
          <p style="color: #7d6033; font-size: 16px;">Your account has been created</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(163,130,76,0.1);">
          <h3 style="color: #a3824c; margin-top: 0;">Hi ${user.firstName},</h3>
          <p style="color: #2e3a1b; line-height: 1.6;">Your account has been created by an administrator. You can now log in to Golden Basket Mart using the credentials below:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e6d897;">
            <h4 style="color: #a3824c; margin-top: 0;">Your Login Details:</h4>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${systemGeneratedPassword}</code></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/login" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(163,130,76,0.3);">Login Now</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7d6033; font-size: 14px;">
          <p>Best regards,<br><strong>Golden Basket Mart Team</strong></p>
        </div>
      </div>
    `;

    await sendEmail(
      user.email,
      'Welcome to Golden Basket Mart - Your Account Has Been Created',
      emailHtml
    );

    logger.info(
      `Invitation email sent to user by admin ${req.user.userId}: ${user.email}`
    );
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
    const inviterId = req.user.userId; // Get the admin who is creating the user

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
      email: email.toLowerCase(),
      password: await bcrypt.hash(systemGeneratedPassword, 12),
      role: 'user',
      isVerified: false,
      isDefaultPassword: true,
      inviter: inviterId,
    });
    await user.save();

    // Send invitation email with login credentials
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #a3824c; margin: 0;">Welcome to Golden Basket Mart!</h2>
          <p style="color: #7d6033; font-size: 16px;">Your account has been created</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(163,130,76,0.1);">
          <h3 style="color: #a3824c; margin-top: 0;">Hi ${firstName},</h3>
          <p style="color: #2e3a1b; line-height: 1.6;">Your account has been created by an administrator. You can now log in to Golden Basket Mart using the credentials below:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e6d897;">
            <h4 style="color: #a3824c; margin-top: 0;">Your Login Details:</h4>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${systemGeneratedPassword}</code></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/login" style="background: linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(163,130,76,0.3);">Login Now</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7d6033; font-size: 14px;">
          <p>Best regards,<br><strong>Golden Basket Mart Team</strong></p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      'Welcome to Golden Basket Mart - Your Account Has Been Created',
      emailHtml
    );

    logger.info(`New user created by admin ${inviterId}: ${email}`);
    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    logger.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};
