const db = require('../database/connection')
const ResponseHelper = require('../utils/response')
const logger = require('../utils/logger')

class ChartController {
  async getAllCharts(req, res) {
    try {
      const charts = await db.query('SELECT * FROM t_chart ORDER BY sort_order ASC')
      for (const c of charts) {
        c.songs = await db.query(
          'SELECT * FROM t_chart_song WHERE chart_id = ? ORDER BY rank_order ASC',
          [c.id]
        )
      }
      res.json(ResponseHelper.success(charts, '查询成功'))
    } catch (error) {
      logger.error('getAllCharts error', { error: error.message })
      res.status(500).json(ResponseHelper.error('查询失败'))
    }
  }
}

module.exports = new ChartController()
