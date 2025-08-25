import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build optimization
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },

    // Bundle splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form'],
          'utils-vendor': ['axios', 'dayjs', 'react-slick'],
        },

        // Asset optimization
        assetFileNames: assetInfo => {
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }

          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }

          return `assets/[name]-[hash][extname]`;
        },

        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Source maps for development
    sourcemap: false, // Disabled for now to fix build issues
  },

  // Development server optimization
  server: {
    port: 5173,
    host: true,
    open: true,

    // Enable HMR with optimization
    hmr: {
      overlay: true,
    },

    // Optimize for development
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        'react-router-dom',
        '@tanstack/react-query',
        'react-hook-form',
        'axios',
      ],
    },
  },

  // Preview server
  preview: {
    port: 4173,
    host: true,
    open: true,
  },

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@contexts': fileURLToPath(new URL('./src/contexts', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },

  // CSS optimization
  css: {
    devSourcemap: true,

    // PostCSS configuration
    postcss: {
      plugins: [
        // Auto-prefixer for better browser compatibility
        autoprefixer({
          overrideBrowserslist: [
            '> 1%',
            'last 2 versions',
            'not dead',
            'not ie 11',
          ],
        }),

        // CSS optimization
        cssnano({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: false,
            },
          ],
        }),
      ],
    },
  },

  // Define environment variables
  define: {
    __DEV__: 'false', // Simplified for build
    __PROD__: 'true', // Simplified for build
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

    exclude: [
      // Exclude large dependencies that should be loaded separately
      'pdfkit',
      'nodemailer',
    ],
  },

  // Experimental features
  experimental: {
    // Enable new Vite features
    // renderBuiltUrl: true, // Removed - causing build issues
  },

  // Performance optimization
  esbuild: {
    // Remove console.log in production
    drop: ['console', 'debugger'], // Always remove for cleaner builds

    // Optimize JSX
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },

  // Worker configuration
  worker: {
    format: 'es',
  },

  // Legacy browser support - removed to fix React 19 compatibility
  // legacy: {
  //   buildSsrCjsExternalHeuristics: true,
  // },
});
