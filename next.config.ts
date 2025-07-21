import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for stability
  experimental: {
    // Optimize CSS loading
    optimizeCss: true,
    // Enable memory optimization
    memoryBasedWorkersCount: true,
    // Enable webpack cache for faster rebuilds
    webpackBuildWorker: true,
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['sharp', 'multer'],

  // Webpack configuration for stability and performance
  webpack: (config, { dev, isServer }) => {
    // Enhanced file watching options
    config.watchOptions = {
      // Ignore problematic directories
      ignored: [
        '**/node_modules/**',
        '**/storage/uploads/**',
        '**/public/uploads/**',
        '**/.next/**',
        '**/.git/**',
        '**/dist/**',
        '**/coverage/**',
        '**/tmp/**',
        '**/*.log'
      ],
      // Optimize polling settings
      poll: false,
      aggregateTimeout: 300,
      // Reduce memory usage
      followSymlinks: false,
    };

    // Memory optimization for development
    if (dev) {
      // Reduce bundle analyzer overhead
      config.infrastructureLogging = {
        level: 'warn',
      };
    }

    // Performance optimizations
    config.performance = {
      hints: false,
    };

    return config;
  },

  // Static file serving configuration
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/files/:path*',
      },
    ];
  },

  // Output configuration
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,
  
  // Power saving mode for development
  poweredByHeader: false,
  
  // Reduce memory usage
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
