module.exports = {
  apps: [
    {
      name: 'jobflow-ai',
      script: '.next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/deploy/logs/jobflow-error.log',
      out_file: '/home/deploy/logs/jobflow-out.log',
      merge_logs: true,
    },
  ],
};
