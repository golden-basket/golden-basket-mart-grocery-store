const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isDefaultPassword: { type: Boolean, default: false },
    inviter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Enhanced authentication fields
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    failedLoginAttempts: [
      {
        timestamp: { type: Date, default: Date.now },
        ip: { type: String },
        userAgent: { type: String },
      },
    ],

    // Account security settings
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    backupCodes: [{ type: String }],

    // Preferences
    emailNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },

    // Account status
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String },
    suspensionExpires: { type: Date },

    // Profile completion
    profileCompleted: { type: Boolean, default: false },
    avatar: { type: String },

    // Social login (future enhancement)
    socialLogins: [
      {
        provider: { type: String, enum: ['google', 'facebook', 'apple'] },
        providerId: { type: String },
        accessToken: { type: String },
        refreshToken: { type: String },
        expiresAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ inviter: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ lockUntil: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isSuspended: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for account status
userSchema.virtual('accountStatus').get(function () {
  if (this.isSuspended) return 'suspended';
  if (this.isLocked) return 'locked';
  if (!this.isActive) return 'inactive';
  if (!this.isVerified) return 'unverified';
  return 'active';
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // Hash password with salt rounds
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for profile completion check
userSchema.pre('save', function (next) {
  if (
    this.isModified('firstName') ||
    this.isModified('lastName') ||
    this.isModified('phone')
  ) {
    this.profileCompleted = !!(this.firstName && this.lastName && this.phone);
  }
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLoginAt: new Date() },
  });
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Instance method to clear password reset token
userSchema.methods.clearPasswordResetToken = function () {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

// Instance method to clear email verification token
userSchema.methods.clearEmailVerificationToken = function () {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
};

// Instance method to add failed login attempt
userSchema.methods.addFailedLoginAttempt = function (ip, userAgent) {
  const failedAttempt = {
    timestamp: new Date(),
    ip: ip,
    userAgent: userAgent,
  };

  // Keep only last 10 failed attempts
  const failedAttempts = [...this.failedLoginAttempts, failedAttempt].slice(
    -10
  );

  return this.updateOne({
    $set: { failedLoginAttempts: failedAttempts },
  });
};

// Static method to find by email (case insensitive)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({
    isActive: true,
    isSuspended: false,
    $or: [
      { lockUntil: { $exists: false } },
      { lockUntil: { $lt: new Date() } },
    ],
  });
};

// Static method to find users by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role: role, isActive: true });
};

// Static method to find verified users
userSchema.statics.findVerified = function () {
  return this.find({ isVerified: true, isActive: true });
};

// Static method to cleanup expired tokens
userSchema.statics.cleanupExpiredTokens = function () {
  const now = new Date();
  return this.updateMany(
    {
      $or: [
        { emailVerificationExpires: { $lt: now } },
        { passwordResetExpires: { $lt: now } },
      ],
    },
    {
      $unset: {
        emailVerificationToken: 1,
        emailVerificationExpires: 1,
        passwordResetToken: 1,
        passwordResetExpires: 1,
      },
    }
  );
};

// Static method to cleanup expired locks
userSchema.statics.cleanupExpiredLocks = function () {
  return this.updateMany(
    { lockUntil: { $lt: new Date() } },
    { $unset: { lockUntil: 1, loginAttempts: 1 } }
  );
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remove sensitive fields from JSON output
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.twoFactorSecret;
    delete ret.backupCodes;
    delete ret.failedLoginAttempts;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
