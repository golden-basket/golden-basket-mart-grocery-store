const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenManager {
  constructor() {
    this.refreshTokens = new Map();
    this.blacklistedTokens = new Map();
    this.cleanupInterval = null;

    // Start cleanup process
    this.startCleanup();
  }

  // Generate access and refresh tokens
  generateTokens(user) {
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
        type: 'access',
        jti: crypto.randomBytes(16).toString('hex'), // JWT ID for tracking
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        type: 'refresh',
        jti: crypto.randomBytes(16).toString('hex'),
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
    );

    // Store refresh token with expiration
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.refreshTokens.set(refreshToken, {
      userId: user._id.toString(),
      expiresAt,
      createdAt: Date.now(),
    });

    return { accessToken, refreshToken };
  }

  // Verify refresh token
  verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      // Check if token exists in storage
      const storedToken = this.refreshTokens.get(refreshToken);
      if (!storedToken) {
        return null;
      }

      // Check if token has expired
      if (Date.now() > storedToken.expiresAt) {
        this.refreshTokens.delete(refreshToken);
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Invalidate refresh token
  invalidateRefreshToken(refreshToken) {
    this.refreshTokens.delete(refreshToken);
  }

  // Blacklist access token
  blacklistToken(token) {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      this.blacklistedTokens.set(token, expiresAt);
    }
  }

  // Check if token is blacklisted
  isTokenBlacklisted(token) {
    const blacklistedUntil = this.blacklistedTokens.get(token);
    if (!blacklistedUntil) {
      return false;
    }

    // Remove expired blacklisted tokens
    if (Date.now() > blacklistedUntil) {
      this.blacklistedTokens.delete(token);
      return false;
    }

    return true;
  }

  // Cleanup expired tokens
  cleanup() {
    const now = Date.now();

    // Cleanup expired refresh tokens
    for (const [token, data] of this.refreshTokens.entries()) {
      if (now > data.expiresAt) {
        this.refreshTokens.delete(token);
      }
    }

    // Cleanup expired blacklisted tokens
    for (const [token, expiresAt] of this.blacklistedTokens.entries()) {
      if (now > expiresAt) {
        this.blacklistedTokens.delete(token);
      }
    }
  }

  // Start automatic cleanup
  startCleanup() {
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    ); // Cleanup every 5 minutes
  }

  // Stop cleanup process
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Get storage statistics
  getStats() {
    return {
      activeRefreshTokens: this.refreshTokens.size,
      blacklistedTokens: this.blacklistedTokens.size,
      lastCleanup: Date.now(),
    };
  }
}

// Export singleton instance
module.exports = new TokenManager();
