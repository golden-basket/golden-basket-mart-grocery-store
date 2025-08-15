const mongoose = require('mongoose');
const logger = require('./logger');

class DatabaseOptimizer {
  constructor() {
    this.connection = mongoose.connection;
    this.setupEventListeners();
  }

  // Setup database event listeners
  setupEventListeners() {
    this.connection.on('connected', () => {
      logger.info('Database connected - running optimization checks');
      this.runOptimizationChecks();
    });

    this.connection.on('error', error => {
      logger.error('Database connection error:', error);
    });
  }

  // Run optimization checks
  async runOptimizationChecks() {
    try {
      await this.checkIndexes();
      await this.analyzeQueryPerformance();
      await this.optimizeCollections();
    } catch (error) {
      logger.error('Optimization checks failed:', error);
    }
  }

  // Check and create missing indexes
  async checkIndexes() {
    const collections = await this.connection.db.listCollections().toArray();

    for (const collection of collections) {
      await this.optimizeCollectionIndexes(collection.name);
    }
  }

  // Optimize indexes for a specific collection
  async optimizeCollectionIndexes(collectionName) {
    try {
      const collection = this.connection.db.collection(collectionName);
      const indexes = await collection.indexes();

      logger.info(`Checking indexes for collection: ${collectionName}`);

      // Check for missing indexes based on collection name
      switch (collectionName) {
        case 'users':
          await this.ensureUserIndexes(collection, indexes);
          break;
        case 'products':
          await this.ensureProductIndexes(collection, indexes);
          break;
        case 'orders':
          await this.ensureOrderIndexes(collection, indexes);
          break;
        case 'carts':
          await this.ensureCartIndexes(collection, indexes);
          break;
        case 'categories':
          await this.ensureCategoryIndexes(collection, indexes);
          break;
        default:
          // Generic index optimization
          await this.ensureGenericIndexes(collection, indexes);
      }
    } catch (error) {
      logger.error(`Failed to optimize indexes for ${collectionName}:`, error);
    }
  }

  // Ensure user collection indexes
  async ensureUserIndexes(collection, existingIndexes) {
    const requiredIndexes = [
      { key: { email: 1 }, unique: true },
      { key: { role: 1 } },
      { key: { isVerified: 1 } },
      { key: { createdAt: -1 } },
      { key: { lastLoginAt: -1 } },
      { key: { isActive: 1 } },
      { key: { emailVerificationToken: 1 }, sparse: true },
      { key: { passwordResetToken: 1 }, sparse: true },
    ];

    await this.createMissingIndexes(
      collection,
      existingIndexes,
      requiredIndexes
    );
  }

  // Ensure product collection indexes
  async ensureProductIndexes(collection, existingIndexes) {
    const requiredIndexes = [
      { key: { name: 'text', description: 'text' } },
      { key: { category: 1 } },
      { key: { stock: 1 } },
      { key: { price: 1 } },
      { key: { createdAt: -1 } },
      { key: { ratings: -1 } },
      { key: { category: 1, price: 1, stock: 1 } },
      { key: { category: 1, createdAt: -1 } },
      { key: { price: 1, stock: 1 } },
      { key: { ratings: -1, createdAt: -1 } },
    ];

    await this.createMissingIndexes(
      collection,
      existingIndexes,
      requiredIndexes
    );
  }

  // Ensure order collection indexes
  async ensureOrderIndexes(collection, existingIndexes) {
    const requiredIndexes = [
      { key: { user: 1 } },
      { key: { orderStatus: 1 } },
      { key: { paymentStatus: 1 } },
      { key: { createdAt: -1 } },
      { key: { user: 1, createdAt: -1 } },
      { key: { orderStatus: 1, createdAt: -1 } },
      { key: { paymentStatus: 1, createdAt: -1 } },
      { key: { totalAmount: -1 } },
    ];

    await this.createMissingIndexes(
      collection,
      existingIndexes,
      requiredIndexes
    );
  }

  // Ensure cart collection indexes
  async ensureCartIndexes(collection, existingIndexes) {
    const requiredIndexes = [
      { key: { user: 1 }, unique: true },
      { key: { 'items.product': 1 } },
      { key: { updatedAt: -1 } },
    ];

    await this.createMissingIndexes(
      collection,
      existingIndexes,
      requiredIndexes
    );
  }

  // Ensure category collection indexes
  async ensureCategoryIndexes(collection, existingIndexes) {
    const requiredIndexes = [
      { key: { name: 1 }, unique: true },
      { key: { createdAt: -1 } },
    ];

    await this.createMissingIndexes(
      collection,
      existingIndexes,
      requiredIndexes
    );
  }

  // Generic index optimization
  async ensureGenericIndexes(collection, existingIndexes) {
    const requiredIndexes = [
      { key: { createdAt: -1 } },
      { key: { updatedAt: -1 } },
    ];

    await this.createMissingIndexes(
      collection,
      existingIndexes,
      requiredIndexes
    );
  }

  // Create missing indexes
  async createMissingIndexes(collection, existingIndexes, requiredIndexes) {
    for (const requiredIndex of requiredIndexes) {
      const indexExists = existingIndexes.some(
        existingIndex =>
          JSON.stringify(existingIndex.key) ===
          JSON.stringify(requiredIndex.key)
      );

      if (!indexExists) {
        try {
          await collection.createIndex(requiredIndex.key, {
            unique: requiredIndex.unique || false,
            sparse: requiredIndex.sparse || false,
            background: true, // Create index in background
          });
          logger.info(
            `Created index for ${collection.collectionName}:`,
            requiredIndex.key
          );
        } catch (error) {
          logger.error(
            `Failed to create index for ${collection.collectionName}:`,
            error
          );
        }
      }
    }
  }

  // Analyze query performance
  async analyzeQueryPerformance() {
    try {
      // Get slow query statistics
      const stats = await this.connection.db
        .admin()
        .command({ getLog: 'global' });

      if (stats.log && stats.log.length > 0) {
        const slowQueries = stats.log.filter(
          log => log.includes('slow query') || log.includes('slow operation')
        );

        if (slowQueries.length > 0) {
          logger.warn('Slow queries detected:', slowQueries);
        }
      }
    } catch (error) {
      logger.error('Failed to analyze query performance:', error);
    }
  }

  // Optimize collections
  async optimizeCollections() {
    try {
      const collections = await this.connection.db.listCollections().toArray();

      for (const collection of collections) {
        try {
          // Run collection optimization
          await this.connection.db.command({
            collMod: collection.name,
            validator: {}, // Add validation if needed
            validationLevel: 'moderate',
          });

          logger.info(`Optimized collection: ${collection.name}`);
        } catch (error) {
          // Collection optimization might fail for system collections
          if (!collection.name.startsWith('system.')) {
            logger.warn(
              `Failed to optimize collection ${collection.name}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      logger.error('Collection optimization failed:', error);
    }
  }

  // Get database statistics
  async getDatabaseStats() {
    try {
      const stats = await this.connection.db.stats();
      const collections = await this.connection.db.listCollections().toArray();

      return {
        database: stats.db,
        collections: collections.length,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
      };
    } catch (error) {
      logger.error('Failed to get database stats:', error);
      return null;
    }
  }

  // Get collection statistics
  async getCollectionStats(collectionName) {
    try {
      const collection = this.connection.db.collection(collectionName);
      const stats = await collection.stats();
      const indexes = await collection.indexes();

      return {
        name: collectionName,
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        indexes: indexes.length,
        indexSize: stats.totalIndexSize,
      };
    } catch (error) {
      logger.error(
        `Failed to get stats for collection ${collectionName}:`,
        error
      );
      return null;
    }
  }

  // Monitor slow queries
  async enableSlowQueryMonitoring(thresholdMs = 100) {
    try {
      await this.connection.db.admin().command({
        setParameter: 1,
        slowms: thresholdMs,
      });

      logger.info(
        `Slow query monitoring enabled with threshold: ${thresholdMs}ms`
      );
    } catch (error) {
      logger.error('Failed to enable slow query monitoring:', error);
    }
  }

  // Get index usage statistics
  async getIndexUsageStats() {
    try {
      const collections = await this.connection.db.listCollections().toArray();
      const stats = {};

      for (const collection of collections) {
        try {
          const collectionStats = await this.connection.db
            .collection(collection.name)
            .stats();
          stats[collection.name] = {
            indexes: collectionStats.nindexes,
            indexSize: collectionStats.totalIndexSize,
            avgObjSize: collectionStats.avgObjSize,
          };
        } catch (error) {
          // Skip system collections
          if (!collection.name.startsWith('system.')) {
            logger.warn(`Failed to get stats for ${collection.name}:`, error);
          }
        }
      }

      return stats;
    } catch (error) {
      logger.error('Failed to get index usage stats:', error);
      return null;
    }
  }
}

// Export singleton instance
module.exports = new DatabaseOptimizer();
