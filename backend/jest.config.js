module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js',
    '**/*.test.js',
    '**/*.spec.js',
  ],

  // Test coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/index.js',
    '!src/app.js',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset modules between tests
  resetModules: true,

  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },

  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  },

  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  // Babel configuration
  transformIgnorePatterns: [
    'node_modules/(?!(express|mongoose|jsonwebtoken|bcrypt|joi|winston|nodemailer|pdfkit)/)',
  ],

  // Test path ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/build/'],

  // Watch path ignore patterns
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/',
  ],

  // Global test setup
  globalSetup: '<rootDir>/__tests__/globalSetup.js',

  // Global test teardown
  globalTeardown: '<rootDir>/__tests__/globalTeardown.js',

  // Test reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],

  // Test results processor
  testResultsProcessor: 'jest-junit',

  // Notify mode
  notify: false,

  // Error on missing coverage
  errorOnDeprecated: true,

  // Force exit
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,

  // Detect leaks
  detectLeaks: true,

  // Log heap usage
  logHeapUsage: true,

  // Run tests in band
  runInBand: false,

  // Max workers
  maxWorkers: '50%',

  // Cache
  cache: true,

  // Cache directory
  cacheDirectory: '.jest-cache',

  // Prettier path
  prettierPath: require.resolve('prettier'),
};
