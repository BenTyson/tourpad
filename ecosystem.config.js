module.exports = {
  apps: [{
    name: 'tourpad-dev',
    script: 'npm',
    args: 'run dev:stable',
    cwd: '/Users/bentyson/pad',
    
    // Restart settings
    watch: ['src', 'app', 'pages', 'components', 'lib'],
    ignore_watch: ['node_modules', '.next', 'public/uploads', 'logs'],
    watch_delay: 1000,
    
    // Auto restart on crash
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Memory management
    max_memory_restart: '2G',
    
    // Environment
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      NODE_OPTIONS: '--max-old-space-size=8192'
    },
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    merge_logs: true,
    time: true,
    
    // Advanced crash handling
    listen_timeout: 3000,
    kill_timeout: 5000,
    
    // Exponential backoff restart delay
    exp_backoff_restart_delay: 100
  }]
};