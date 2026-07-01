const db = require('../database/connection')
const ResponseHelper = require('../utils/response')
const logger = require('../utils/logger')

class RecommendController {
  async getBanners(req, res) {
    try {
      const rows = await db.query('SELECT * FROM t_banner ORDER BY sort_order ASC LIMIT 10')
      res.json(ResponseHelper.success(rows, '查询成功'))
    } catch (error) {
      logger.error('getBanners error', { error: error.message })
      res.status(500).json(ResponseHelper.error('查询失败'))
    }
  }

  async getEvents(req, res) {
    try {
      const rows = await db.query('SELECT * FROM t_event ORDER BY sort_order ASC LIMIT 10')
      res.json(ResponseHelper.success(rows, '查询成功'))
    } catch (error) {
      logger.error('getEvents error', { error: error.message })
      res.status(500).json(ResponseHelper.error('查询失败'))
    }
  }

  async getRecommendData(req, res) {
    try {
      const banners = await db.query('SELECT * FROM t_banner ORDER BY sort_order ASC LIMIT 10')
      const events = await db.query('SELECT * FROM t_event ORDER BY sort_order ASC LIMIT 10')
      res.json(ResponseHelper.success({ banners, events }, '查询成功'))
    } catch (error) {
      logger.error('getRecommendData error', { error: error.message })
      res.status(500).json(ResponseHelper.error('查询失败'))
    }
  }
}

module.exports = new RecommendController()
