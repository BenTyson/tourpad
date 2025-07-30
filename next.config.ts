import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // DISABLE ALL EXPERIMENTAL FEATURES for maximum stability
  experimental: {
    // Disable everything that could cause crashes
    optimizeCss: false,
    memoryBasedWorkersCount: false,
    webpackBuildWorker: true,
    turbo: false,
    serverComponentsExternalPackages: [],
    serverActions: false,
    typedRoutes: false,
    mdxRs: false,
    instrumentationHook: false,
  },

  serverExternalPackages: ['sharp', 'multer'],

  // STABLE webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable cache completely to prevent corruption
      config.cache = false;
      
      // Ultra-conservative file watching
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/public/uploads/**',
          '**/.next/**',
          '**/.git/**',
          '**/*.log',
          '**/prisma/dev.db**',
          '**/prisma/dev.db-journal**',
          '**/storage/**',
          '**/tmp/**',
          '**/.env*'
        ],
        poll: false,                    // No polling
        aggregateTimeout: 2000,         // Increased for stability
        followSymlinks: false,          // Prevent symlink issues
      };

      // Minimal logging
      config.infrastructureLogging = {
        level: 'error',
      };

      // Minimal stats
      config.stats = 'errors-only';
      
      // Single thread to prevent race conditions
      config.parallelism = 1;
      
      // Disable optimizations that cause crashes
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        runtimeChunk: false,
      };
    }

    // Disable performance hints to reduce overhead
    config.performance = {
      hints: false,
    };

    return config;
  },

  // Static file serving
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/files/:path*',
      },
    ];
  },

  output: 'standalone',
  
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  compress: true,
  poweredByHeader: false,
  
  // STABLE memory management - increased limits for stability
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,      // Increased from 25s to 60s
    pagesBufferLength: 5,           // Increased buffer size
  },
  
  // Additional stability configurations
  generateEtags: false,             // Reduce overhead
  distDir: '.next',                 // Explicit dist directory
  
  // Additional stability settings (swcMinify removed - not a valid config)
};

export default nextConfig;