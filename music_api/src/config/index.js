module.exports = {
  server: {
    port: process.env.PORT || 8000,
    env: process.env.NODE_ENV || 'development'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'music_db',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    filename: process.env.LOG_FILE || 'logs/app.log'
  }
};
