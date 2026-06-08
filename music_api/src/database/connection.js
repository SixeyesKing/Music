const mysql = require('mysql2/promise');
const config = require('../config');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    try {
      this.pool = mysql.createPool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        connectionLimit: config.database.connectionLimit,
        waitForConnections: config.database.waitForConnections,
        queueLimit: config.database.queueLimit
      });

      const connection = await this.pool.getConnection();
      logger.info('数据库连接成功', { host: config.database.host, database: config.database.database });
      connection.release();
      return true;
    } catch (error) {
      logger.error('数据库连接失败', { error: error.message });
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      logger.error('数据库查询失败', { sql, error: error.message });
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async transaction(callback) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      logger.info('数据库连接已关闭');
    }
  }
}

module.exports = new Database();
