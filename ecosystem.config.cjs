module.exports = {
  apps: [
    {
      name: 'personal-website-api',
      script: 'dist/src/server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
