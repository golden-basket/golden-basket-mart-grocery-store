import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  // Test configuration
  test: {
    // Test environment
    environment: 'jsdom',

    // Test file patterns
    include: [
      '**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],

    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],

    // Test coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'coverage/**',
        'dist/**',
        'build/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**',
        '**/test/**',
        '**/*.test.*',
        '**/*.spec.*',
        'src/main.jsx',
        'src/index.css',
        'src/App.css',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },

    // Test timeout
    testTimeout: 10000,

    // Hook timeout
    hookTimeout: 10000,

    // Global setup
    setupFiles: ['./src/__tests__/setup.js'],

    // Environment variables
    env: {
      NODE_ENV: 'test',
    },

    // Test globals
    globals: true,

    // Mock DOM
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },

    // Test reporters
    reporters: ['verbose', 'html'],

    // Output file
    outputFile: 'test-results.json',

    // Pool options
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Threads
    threads: false,

    // Isolate
    isolate: true,

    // Restore mocks
    restoreMocks: true,

    // Clear mocks
    clearMocks: true,

    // Mock reset
    mockReset: true,

    // Unhandled rejections
    onUnhandledRejection: 'strict',

    // Uncaught exceptions
    onUncaughtException: 'strict',
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },

  // Define globals
  define: {
    __DEV__: true,
    __PROD__: false,
    __TEST__: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'react-router-dom',
      '@tanstack/react-query',
      'react-hook-form',
      'axios',
      'dayjs',
      'react-slick',
    ],
  },

  // CSS handling
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },

  // Build options
  build: {
    target: 'es2015',
    sourcemap: true,
  },

  // Server options
  server: {
    port: 5173,
    host: true,
  },

  // Preview options
  preview: {
    port: 4173,
    host: true,
  },
});
