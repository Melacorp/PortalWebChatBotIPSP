/**
 * Configuración de PM2 para Portal Web ChatBot IPSP
 * Este archivo define cómo PM2 debe ejecutar la aplicación
 */

module.exports = {
  apps: [
    {
      name: 'portal-chatbot-ipsp',
      script: 'serve',
      args: '-s dist -l 5020',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      merge_logs: true,
    },
  ],
};
