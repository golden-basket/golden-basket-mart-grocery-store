import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

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

          // Feature chunks
          auth: [
            './src/contexts/AuthContext.jsx',
            './src/hooks/useAuth.js',
            './src/components/ProtectedRoute.jsx',
          ],
          admin: ['./src/pages/Admin.jsx', './src/components/admin/'],
          cart: ['./src/pages/Cart.jsx', './src/hooks/useCart.js'],
          products: [
            './src/pages/Catalogue.jsx',
            './src/components/OptimizedProductCard.jsx',
            './src/hooks/useProducts.js',
          ],
        },

        // Asset optimization
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

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
    sourcemap: process.env.NODE_ENV === 'development',
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
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
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
    renderBuiltUrl: true,
  },

  // Performance optimization
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],

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
