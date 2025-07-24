import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // STABLE experimental features only - no caching issues
  experimental: {
    // Disable problematic features that cause crashes
    optimizeCss: false,          // Disable during development
    memoryBasedWorkersCount: false,  // Use default worker count
    webpackBuildWorker: false,   // Disable for stability
  },

  serverExternalPackages: ['sharp', 'multer'],

  // STABLE webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // CRITICAL: Disable webpack cache to prevent corruption
      config.cache = false;
      
      // Simplified file watching - no aggressive polling
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/public/uploads/**',
          '**/.next/**',
          '**/.git/**',
          '**/*.log'
        ],
        poll: false,                    // No polling
        aggregateTimeout: 500,          // Increased for stability
        followSymlinks: false,          // Prevent symlink issues
      };

      // Reduce log noise and memory pressure
      config.infrastructureLogging = {
        level: 'error',
      };

      // Prevent memory leaks
      config.stats = 'errors-warnings';
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