const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Migration function to add new fields to existing users
const migrateUsers = async () => {
  try {
    logger.info('Starting user migration...');

    // Get all users
    const users = await User.find({});
    logger.info(`Found ${users.length} users to migrate`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const updates = {};

        // Add missing fields with default values
        if (user.emailVerificationToken === undefined) {
          updates.emailVerificationToken = null;
        }
        if (user.emailVerificationExpires === undefined) {
          updates.emailVerificationExpires = null;
        }
        if (user.passwordResetToken === undefined) {
          updates.passwordResetToken = null;
        }
        if (user.passwordResetExpires === undefined) {
          updates.passwordResetExpires = null;
        }
        if (user.lastLoginAt === undefined) {
          updates.lastLoginAt = null;
        }
        if (user.lastLoginIp === undefined) {
          updates.lastLoginIp = null;
        }
        if (user.loginAttempts === undefined) {
          updates.loginAttempts = 0;
        }
        if (user.lockUntil === undefined) {
          updates.lockUntil = null;
        }
        if (user.failedLoginAttempts === undefined) {
          updates.failedLoginAttempts = [];
        }
        if (user.twoFactorEnabled === undefined) {
          updates.twoFactorEnabled = false;
        }
        if (user.twoFactorSecret === undefined) {
          updates.twoFactorSecret = null;
        }
        if (user.backupCodes === undefined) {
          updates.backupCodes = [];
        }
        if (user.emailNotifications === undefined) {
          updates.emailNotifications = true;
        }
        if (user.marketingEmails === undefined) {
          updates.marketingEmails = false;
        }
        if (user.language === undefined) {
          updates.language = 'en';
        }
        if (user.timezone === undefined) {
          updates.timezone = 'UTC';
        }
        if (user.isActive === undefined) {
          updates.isActive = true;
        }
        if (user.isSuspended === undefined) {
          updates.isSuspended = false;
        }
        if (user.suspensionReason === undefined) {
          updates.suspensionReason = null;
        }
        if (user.suspensionExpires === undefined) {
          updates.suspensionExpires = null;
        }
        if (user.profileCompleted === undefined) {
          // Calculate profile completion based on existing data
          updates.profileCompleted = !!(
            user.firstName &&
            user.lastName &&
            user.phone
          );
        }
        if (user.avatar === undefined) {
          updates.avatar = null;
        }
        if (user.socialLogins === undefined) {
          updates.socialLogins = [];
        }

        // Update user if there are changes
        if (Object.keys(updates).length > 0) {
          await User.findByIdAndUpdate(user._id, updates, { new: true });
          updatedCount++;
          logger.info(`Updated user: ${user.email}`);
        }
      } catch (error) {
        errorCount++;
        logger.error(`Error updating user ${user.email}:`, error);
      }
    }

    logger.info(
      `Migration completed. Updated: ${updatedCount}, Errors: ${errorCount}`
    );

    // Create indexes for better performance
    logger.info('Creating indexes...');
    await User.collection.createIndex({ email: 1 });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isVerified: 1 });
    await User.collection.createIndex({ createdAt: -1 });
    await User.collection.createIndex({ inviter: 1 });
    await User.collection.createIndex({ emailVerificationToken: 1 });
    await User.collection.createIndex({ passwordResetToken: 1 });
    await User.collection.createIndex({ lockUntil: 1 });
    await User.collection.createIndex({ isActive: 1 });
    await User.collection.createIndex({ isSuspended: 1 });
    logger.info('Indexes created successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

// Cleanup function to remove expired tokens and locks
const cleanupExpiredData = async () => {
  try {
    logger.info('Starting cleanup of expired data...');

    // Cleanup expired email verification tokens
    const expiredVerificationResult = await User.updateMany(
      {
        emailVerificationExpires: { $lt: new Date() },
      },
      {
        $unset: {
          emailVerificationToken: 1,
          emailVerificationExpires: 1,
        },
      }
    );
    logger.info(
      `Cleaned up ${expiredVerificationResult.modifiedCount} expired email verification tokens`
    );

    // Cleanup expired password reset tokens
    const expiredResetResult = await User.updateMany(
      {
        passwordResetExpires: { $lt: new Date() },
      },
      {
        $unset: {
          passwordResetToken: 1,
          passwordResetExpires: 1,
        },
      }
    );
    logger.info(
      `Cleaned up ${expiredResetResult.modifiedCount} expired password reset tokens`
    );

    // Cleanup expired account locks
    const expiredLocksResult = await User.updateMany(
      {
        lockUntil: { $lt: new Date() },
      },
      {
        $unset: {
          lockUntil: 1,
          loginAttempts: 1,
        },
      }
    );
    logger.info(
      `Cleaned up ${expiredLocksResult.modifiedCount} expired account locks`
    );

    // Cleanup old failed login attempts (keep only last 10)
    const usersWithManyFailedAttempts = await User.find({
      'failedLoginAttempts.10': { $exists: true },
    });

    for (const user of usersWithManyFailedAttempts) {
      const recentAttempts = user.failedLoginAttempts.slice(-10);
      await User.findByIdAndUpdate(user._id, {
        failedLoginAttempts: recentAttempts,
      });
    }
    logger.info(
      `Cleaned up failed login attempts for ${usersWithManyFailedAttempts.length} users`
    );

    logger.info('Cleanup completed successfully');
  } catch (error) {
    logger.error('Cleanup failed:', error);
    throw error;
  }
};

// Validation function to check data integrity
const validateData = async () => {
  try {
    logger.info('Starting data validation...');

    const issues = [];

    // Check for users with invalid email formats
    const invalidEmailUsers = await User.find({
      email: { $not: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    });
    if (invalidEmailUsers.length > 0) {
      issues.push(
        `Found ${invalidEmailUsers.length} users with invalid email formats`
      );
    }

    // Check for users with missing required fields
    const missingFieldsUsers = await User.find({
      $or: [
        { firstName: { $exists: false } },
        { lastName: { $exists: false } },
        { email: { $exists: false } },
      ],
    });
    if (missingFieldsUsers.length > 0) {
      issues.push(
        `Found ${missingFieldsUsers.length} users with missing required fields`
      );
    }

    // Check for duplicate emails
    const duplicateEmails = await User.aggregate([
      {
        $group: {
          _id: { $toLower: '$email' },
          count: { $sum: 1 },
          users: { $push: '$_id' },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    if (duplicateEmails.length > 0) {
      issues.push(`Found ${duplicateEmails.length} duplicate email addresses`);
    }

    // Check for users with invalid roles
    const invalidRoleUsers = await User.find({
      role: { $nin: ['user', 'admin'] },
    });
    if (invalidRoleUsers.length > 0) {
      issues.push(`Found ${invalidRoleUsers.length} users with invalid roles`);
    }

    if (issues.length > 0) {
      logger.warn('Data validation issues found:');
      issues.forEach(issue => logger.warn(`- ${issue}`));
    } else {
      logger.info('Data validation passed - no issues found');
    }

    return issues;
  } catch (error) {
    logger.error('Data validation failed:', error);
    throw error;
  }
};

// Main execution function
const main = async () => {
  try {
    await connectDB();

    // Run migration
    await migrateUsers();

    // Run cleanup
    await cleanupExpiredData();

    // Run validation
    await validateData();

    logger.info('All operations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Script execution failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  migrateUsers,
  cleanupExpiredData,
  validateData,
};
