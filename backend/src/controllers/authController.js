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

// Gmail-only configuration - no alternative services needed
// Note: Gmail has daily sending limits:
// - Personal Gmail: 500 recipients per rolling 24-hour period
// - Google Workspace: 2,000 recipients per rolling 24-hour period

// Create optimized Gmail transporter for cloud platforms
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    // Optimized settings for cloud platforms like Render
    pool: true,
    maxConnections: 1, // Single connection for better stability
    maxMessages: 10, // Conservative message limit
    rateLimit: 3, // Very conservative rate limit
    // Shorter timeouts for better error handling
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000, // 15 seconds
    socketTimeout: 30000, // 30 seconds
    // Modern Gmail-specific optimizations
    secure: true,
    port: 465,
    tls: {
      rejectUnauthorized: true, // Use proper certificate validation
      ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
    },
    // Connection management
    keepAlive: false, // Disable keep-alive for cloud environments
    // Retry configuration
    retryDelay: 5000, // 5 seconds between retries
    maxRetries: 3, // Fewer retries for faster failure detection
    // Additional Gmail optimizations
    requireTLS: true,
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });
};

// Optimized Gmail configuration for cloud platforms like Render

// Initialize primary transporter
let transporter = createGmailTransporter();
let currentTransporterType = 'gmail';

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
const getClientIP = req => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket?.remoteAddress ||
    'unknown'
  );
};

// Helper function to get user agent
const getUserAgent = req => {
  return req.get('User-Agent') || 'unknown';
};

// Email queue for background processing
const emailQueue = [];
let isProcessingQueue = false;

// Function to reconnect Gmail service
const reconnectGmailService = async () => {
  try {
    // Close current transporter gracefully
    if (transporter) {
      try {
        transporter.close();
      } catch (closeError) {
        logger.warn('Error closing transporter:', closeError.message);
      }
    }

    // Wait before reconnecting
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create new Gmail transporter
    transporter = createGmailTransporter();
    currentTransporterType = 'gmail';

    // Test the new connection with timeout

    const verifyPromise = await transporter.verify();
    logger.error('Gmail service reconnected successfully', "Verify Promise", verifyPromise);
    if (!verifyPromise) {
      logger.error('Failed to verify Gmail service');
      return false;
    }
    logger.info('Gmail service reconnected successfully');
    return true;
  } catch (error) {
    logger.error('Failed to reconnect Gmail service:', {
      error: error.message,
      code: error.code,
    });
    return false;
  }
};

// Helper function to send email with retry logic and service switching
const sendEmail = async (to, subject, html, retryCount = 0) => {
  const maxRetries = 2; // Reduced retries for faster failure detection
  const retryDelay = Math.pow(2, retryCount) * 2000; // Exponential backoff: 2s, 4s

  try {
    // Check if transporter exists and is valid
    if (!transporter) {
      logger.warn('Transporter not initialized, creating new one');
      transporter = createGmailTransporter();
    }

    // Verify connection before sending with timeout
    try {
      const verifyPromise = transporter.verify();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Connection verification timeout')),
          5000
        )
      );
      await Promise.race([verifyPromise, timeoutPromise]);
    } catch (verifyError) {
      logger.warn(`Connection verification failed: ${verifyError.message}`);
      // Don't fail immediately, try to send anyway
    }

    const mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
      // Add headers for better deliverability
      headers: {
        'X-Mailer': 'Golden Basket Mart',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        // Gmail-specific headers
        'X-Google-Original-From': EMAIL_FROM,
      },
      // Ensure Gmail doesn't rewrite the sender
      replyTo: EMAIL_FROM,
    };

    // Send email with timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const sendTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email send timeout')), 15000)
    );

    const result = await Promise.race([sendPromise, sendTimeoutPromise]);
    logger.info(
      `Email sent successfully to ${to} via ${currentTransporterType}: ${subject}`
    );
    return result;
  } catch (error) {
    logger.error(
      `Failed to send email to ${to} via ${currentTransporterType} (attempt ${retryCount + 1}):`,
      {
        error: error.message,
        code: error.code,
        command: error.command,
      }
    );

    // Try reconnecting Gmail on connection errors (only on first attempt)
    if (
      retryCount === 0 &&
      (error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ENOTFOUND' ||
        error.message.includes('timeout') ||
        error.message.includes('connection') ||
        error.message.includes('verification'))
    ) {
      logger.warn(
        `Attempting to reconnect Gmail service due to connection error`
      );
      const reconnected = await reconnectGmailService();
      if (reconnected) {
        // Retry with reconnected service
        return sendEmail(to, subject, html, retryCount + 1);
      }
    }

    // Handle Gmail-specific errors
    if (
      error.responseCode === 454 &&
      error.message.includes('Too many recipients')
    ) {
      logger.error(`Gmail quota exceeded: ${error.message}`);
      throw new Error(
        'Daily email sending limit exceeded. Please try again tomorrow.'
      );
    }

    // Retry logic for specific error types
    if (
      retryCount < maxRetries &&
      (error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ENOTFOUND' ||
        error.message.includes('timeout') ||
        error.message.includes('connection'))
    ) {
      logger.warn(
        `Retrying email send to ${to} in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`
      );

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      // Recursive retry
      return sendEmail(to, subject, html, retryCount + 1);
    }

    // If all retries failed, throw the error
    throw error;
  }
};

// Add email to queue for background processing
const queueEmail = (to, subject, html, priority = 'normal') => {
  const emailJob = {
    to,
    subject,
    html,
    priority,
    timestamp: Date.now(),
    attempts: 0,
    maxAttempts: 3,
  };

  emailQueue.push(emailJob);
  logger.info(`Email queued for ${to}: ${subject}`);

  // Start processing if not already running
  if (!isProcessingQueue) {
    processEmailQueue();
  }
};

// Process email queue in background with enhanced error handling
const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  logger.info(`Processing email queue with ${emailQueue.length} emails`);

  while (emailQueue.length > 0) {
    const emailJob = emailQueue.shift();

    try {
      // Skip connection verification in queue processing to avoid delays
      // The sendEmail function will handle connection issues internally
      await sendEmail(emailJob.to, emailJob.subject, emailJob.html);
      logger.info(`Background email sent successfully to ${emailJob.to}`);
    } catch (error) {
      // Handle email sending errors with retry logic
      emailJob.attempts++;
      logger.error(`Email sending failed for ${emailJob.to}:`, {
        error: error.message,
        code: error.code,
        attempts: emailJob.attempts,
        maxAttempts: emailJob.maxAttempts,
      });

      if (emailJob.attempts < emailJob.maxAttempts) {
        // Calculate exponential backoff delay
        const delay = Math.min(
          3000 * Math.pow(2, emailJob.attempts - 1),
          15000
        ); // Max 15 seconds

        // Retry after delay
        setTimeout(() => {
          emailQueue.unshift(emailJob);
          processEmailQueue();
        }, delay);

        logger.warn(
          `Email failed for ${emailJob.to}, retrying in ${delay}ms (attempt ${emailJob.attempts}/${emailJob.maxAttempts})`
        );
      } else {
        logger.error(
          `Email permanently failed for ${emailJob.to} after ${emailJob.maxAttempts} attempts`
        );
        // Could implement dead letter queue or notification system here
      }
    }

    // Adaptive delay between emails based on queue size
    const delay = emailQueue.length > 5 ? 500 : 200;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  isProcessingQueue = false;
  logger.info('Email queue processing completed');
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
    const verifyUrl = `${FRONTEND_URL}/#/auth/verify/${verificationToken}`;
    const emailHtml = `
      <div style="font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%); padding: 24px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #15803D; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Welcome to Golden Basket Mart!</h2>
          <p style="color: #166534; font-size: 16px; margin: 8px 0 0; font-weight: 500;">Your fresh grocery journey starts here</p>
        </div>
        
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12); border: 1px solid #E5E7EB;">
          <h3 style="color: #15803D; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hi ${firstName},</h3>
          <p style="color: #374151; line-height: 1.625; font-size: 16px; margin-bottom: 24px;">Thank you for registering with Golden Basket Mart! To complete your registration and start shopping for fresh groceries, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.25s ease; border: none; cursor: pointer;">Verify Email Address</a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-bottom: 8px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #22C55E; font-size: 14px; word-break: break-all; background: #F0FDF4; padding: 12px; border-radius: 6px; border: 1px solid #DCFCE7; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;">${verifyUrl}</p>
          
          <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #F59E0B; border: 1px solid #FEF3C7;">
            <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: 500;"><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #166534; font-size: 14px;">
          <p style="margin: 0 0 8px; font-weight: 500;">Best regards,<br><strong style="color: #15803D;">Golden Basket Mart Team</strong></p>
          <p style="margin: 0; color: #6B7280;">Fresh groceries delivered to your doorstep</p>
        </div>
      </div>
    `;

    // Queue email for background processing instead of waiting
    queueEmail(
      email,
      'Verify your email - Golden Basket Mart',
      emailHtml,
      'high'
    );

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

    if (!token) {
      logger.warn('Email verification attempt without token');
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    // Hash the token to compare with stored hash
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn(
        `Email verification attempt with invalid/expired token: ${token.substring(0, 10)}...`
      );
      return res
        .status(400)
        .json({ error: 'Invalid or expired verification token.' });
    }

    if (user.isVerified) {
      logger.info(
        `Email verification attempt for already verified user: ${user.email}`
      );
      return res.status(200).json({
        message: 'Email is already verified. You can log in.',
        alreadyVerified: true,
      });
    }

    // Verify email and clear token
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified successfully for user: ${user.email}`);
    res.status(200).json({
      message: 'Email verified successfully. You can now log in.',
      success: true,
      redirectUrl: `${FRONTEND_URL}/#/login`,
    });
  } catch (err) {
    logger.error('Email verification error:', err);
    res
      .status(500)
      .json({ error: 'Email verification failed. Please try again.' });
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
    const resetUrl = `${FRONTEND_URL}/#/reset-password?token=${resetToken}`;
    const emailHtml = `
      <div style="font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%); padding: 24px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #15803D; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Password Reset Request</h2>
          <p style="color: #166534; font-size: 16px; margin: 8px 0 0; font-weight: 500;">Golden Basket Mart</p>
        </div>
        
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12); border: 1px solid #E5E7EB;">
          <h3 style="color: #15803D; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hi ${user.firstName},</h3>
          <p style="color: #374151; line-height: 1.625; font-size: 16px; margin-bottom: 24px;">We received a request to reset your password for your Golden Basket Mart account. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.25s ease; border: none; cursor: pointer;">Reset Password</a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-bottom: 8px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #22C55E; font-size: 14px; word-break: break-all; background: #F0FDF4; padding: 12px; border-radius: 6px; border: 1px solid #DCFCE7; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;">${resetUrl}</p>
          
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #EF4444; border: 1px solid #FECACA;">
            <p style="margin: 0 0 12px; color: #B91C1C; font-size: 14px; font-weight: 600;"><strong>Security Notice:</strong></p>
            <ul style="margin: 0; padding-left: 20px; color: #B91C1C; font-size: 14px; line-height: 1.5;">
              <li>This link will expire in 10 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will only be changed if you click the link above</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #166534; font-size: 14px;">
          <p style="margin: 0 0 8px; font-weight: 500;">Best regards,<br><strong style="color: #15803D;">Golden Basket Mart Team</strong></p>
          <p style="margin: 0; color: #6B7280;">Fresh groceries delivered to your doorstep</p>
        </div>
      </div>
    `;

    // Queue email for background processing instead of waiting
    queueEmail(
      email,
      'Reset Your Password - Golden Basket Mart',
      emailHtml,
      'high'
    );

    logger.info(
      `Password reset email queued for: ${email} from IP: ${clientIP}`
    );
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
      return res.status(400).json({
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
    const verifyUrl = `${FRONTEND_URL}/auth/verify/${verificationToken}`;
    const emailHtml = `
      <div style="font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%); padding: 24px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #15803D; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Email Verification</h2>
          <p style="color: #166534; font-size: 16px; margin: 8px 0 0; font-weight: 500;">Golden Basket Mart</p>
        </div>
        
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12); border: 1px solid #E5E7EB;">
          <h3 style="color: #15803D; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hi ${user.firstName},</h3>
          <p style="color: #374151; line-height: 1.625; font-size: 16px; margin-bottom: 24px;">You requested a new email verification link. Please click the button below to verify your email address:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.25s ease; border: none; cursor: pointer;">Verify Email Address</a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-bottom: 8px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #22C55E; font-size: 14px; word-break: break-all; background: #F0FDF4; padding: 12px; border-radius: 6px; border: 1px solid #DCFCE7; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;">${verifyUrl}</p>
          
          <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #22C55E; border: 1px solid #DCFCE7;">
            <p style="margin: 0; color: #15803D; font-size: 14px; font-weight: 500;"><strong>Note:</strong> This verification link will expire in 24 hours.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #166534; font-size: 14px;">
          <p style="margin: 0 0 8px; font-weight: 500;">Best regards,<br><strong style="color: #15803D;">Golden Basket Mart Team</strong></p>
          <p style="margin: 0; color: #6B7280;">Fresh groceries delivered to your doorstep</p>
        </div>
      </div>
    `;

    // Queue email for background processing instead of waiting
    queueEmail(
      email,
      'Verify your email - Golden Basket Mart',
      emailHtml,
      'high'
    );

    logger.info(`Verification email queued for: ${email} from IP: ${clientIP}`);
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
      user => user._id.toString() !== req.user.userId
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
      <div style="font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%); padding: 24px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #15803D; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Welcome to Golden Basket Mart!</h2>
          <p style="color: #166534; font-size: 16px; margin: 8px 0 0; font-weight: 500;">Your account has been created</p>
        </div>
        
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12); border: 1px solid #E5E7EB;">
          <h3 style="color: #15803D; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hi ${user.firstName},</h3>
          <p style="color: #374151; line-height: 1.625; font-size: 16px; margin-bottom: 24px;">Your account has been created by an administrator. You can now log in to Golden Basket Mart using the credentials below:</p>
          
          <div style="background: #F0FDF4; padding: 24px; border-radius: 12px; margin: 24px 0; border: 2px solid #DCFCE7;">
            <h4 style="color: #15803D; margin-top: 0; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Your Login Details:</h4>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #DCFCE7; margin-bottom: 12px;">
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 500;"><strong>Email:</strong> <span style="color: #22C55E; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;">${user.email}</span></p>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #DCFCE7;">
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 500;"><strong>Temporary Password:</strong> <code style="background: #FEF3C7; color: #B45309; padding: 4px 8px; border-radius: 4px; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace; font-weight: 600;">${systemGeneratedPassword}</code></p>
            </div>
          </div>
          
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #EF4444; border: 1px solid #FECACA;">
            <p style="margin: 0; color: #B91C1C; font-size: 14px; font-weight: 500;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${FRONTEND_URL}/login" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.25s ease; border: none; cursor: pointer;">Login Now</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #166534; font-size: 14px;">
          <p style="margin: 0 0 8px; font-weight: 500;">Best regards,<br><strong style="color: #15803D;">Golden Basket Mart Team</strong></p>
          <p style="margin: 0; color: #6B7280;">Fresh groceries delivered to your doorstep</p>
        </div>
      </div>
    `;

    // Queue email for background processing instead of waiting
    queueEmail(
      user.email,
      'Welcome to Golden Basket Mart - Your Account Has Been Created',
      emailHtml,
      'high'
    );

    logger.info(
      `Invitation email queued for user by admin ${req.user.userId}: ${user.email}`
    );
    res.json({ message: 'Invitation email queued successfully.' });
  } catch (err) {
    logger.error('Send invitation email error:', err);
    res.status(500).json({ error: 'Failed to send invitation email.' });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role } = req.body;
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
      role: role || 'user',
      isVerified: false,
      isDefaultPassword: true,
      inviter: inviterId,
    });
    await user.save();

    // Send invitation email with login credentials
    const emailHtml = `
      <div style="font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%); padding: 24px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #15803D; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Welcome to Golden Basket Mart!</h2>
          <p style="color: #166534; font-size: 16px; margin: 8px 0 0; font-weight: 500;">Your account has been created</p>
        </div>
        
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12); border: 1px solid #E5E7EB;">
          <h3 style="color: #15803D; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hi ${firstName},</h3>
          <p style="color: #374151; line-height: 1.625; font-size: 16px; margin-bottom: 24px;">Your account has been created by an administrator. You can now log in to Golden Basket Mart using the credentials below:</p>
          
          <div style="background: #F0FDF4; padding: 24px; border-radius: 12px; margin: 24px 0; border: 2px solid #DCFCE7;">
            <h4 style="color: #15803D; margin-top: 0; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Your Login Details:</h4>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #DCFCE7; margin-bottom: 12px;">
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 500;"><strong>Email:</strong> <span style="color: #22C55E; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;">${email}</span></p>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #DCFCE7;">
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 500;"><strong>Temporary Password:</strong> <code style="background: #FEF3C7; color: #B45309; padding: 4px 8px; border-radius: 4px; font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace; font-weight: 600;">${systemGeneratedPassword}</code></p>
            </div>
          </div>
          
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #EF4444; border: 1px solid #FECACA;">
            <p style="margin: 0; color: #B91C1C; font-size: 14px; font-weight: 500;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${FRONTEND_URL}/login" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.25s ease; border: none; cursor: pointer;">Login Now</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #166534; font-size: 14px;">
          <p style="margin: 0 0 8px; font-weight: 500;">Best regards,<br><strong style="color: #15803D;">Golden Basket Mart Team</strong></p>
          <p style="margin: 0; color: #6B7280;">Fresh groceries delivered to your doorstep</p>
        </div>
      </div>
    `;

    // Queue email for background processing instead of waiting
    queueEmail(
      email,
      'Welcome to Golden Basket Mart - Your Account Has Been Created',
      emailHtml,
      'high'
    );

    logger.info(`New user created by admin ${inviterId}: ${email}`);
    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    logger.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};
