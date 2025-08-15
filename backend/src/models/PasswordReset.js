const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['password_reset', 'email_verification'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ userId: 1 });
passwordResetSchema.index({ type: 1 });
passwordResetSchema.index({ expiresAt: 1 });
passwordResetSchema.index({ used: 1 });

// Pre-save middleware to ensure token is unique
passwordResetSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Check if token already exists
    const existing = await this.constructor.findOne({ token: this.token });
    if (existing) {
      const error = new Error('Token already exists');
      return next(error);
    }
  }
  next();
});

// Instance method to mark token as used
passwordResetSchema.methods.markAsUsed = function () {
  this.used = true;
  this.usedAt = new Date();
  return this.save();
};

// Instance method to check if token is expired
passwordResetSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Instance method to check if token is valid
passwordResetSchema.methods.isValid = function () {
  return !this.used && !this.isExpired();
};

// Static method to find valid token
passwordResetSchema.statics.findValidToken = function (token, type) {
  return this.findOne({
    token: token,
    type: type,
    used: false,
    expiresAt: { $gt: new Date() },
  }).populate('userId');
};

// Static method to cleanup expired tokens
passwordResetSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};

// Static method to cleanup used tokens older than 24 hours
passwordResetSchema.statics.cleanupUsed = function () {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.deleteMany({
    used: true,
    usedAt: { $lt: twentyFourHoursAgo },
  });
};

// Static method to get token statistics
passwordResetSchema.statics.getStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        total: { $sum: 1 },
        used: { $sum: { $cond: ['$used', 1, 0] } },
        expired: {
          $sum: { $cond: [{ $lt: ['$expiresAt', new Date()] }, 1, 0] },
        },
        valid: {
          $sum: {
            $cond: [
              {
                $and: [{ $not: '$used' }, { $gt: ['$expiresAt', new Date()] }],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);
};

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
