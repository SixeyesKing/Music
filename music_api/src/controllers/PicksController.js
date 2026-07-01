const db = require('../database/connection')
const ResponseHelper = require('../utils/response')
const logger = require('../utils/logger')

class PicksController {
  async getData(req, res) {
    try {
      const playlists = await db.query('SELECT * FROM t_picks_playlist ORDER BY sort_order ASC')
      for (const p of playlists) {
        p.songs = await db.query(
          'SELECT * FROM t_picks_playlist_song WHERE playlist_id = ? ORDER BY rank_order ASC',
          [p.id]
        )
      }
      const latest = await db.query('SELECT * FROM t_picks_latest ORDER BY sort_order ASC, col_pos ASC')
      res.json(ResponseHelper.success({ playlists, latest }, '查询成功'))
    } catch (error) {
      logger.error('PicksController.getData error', { error: error.message })
      res.status(500).json(ResponseHelper.error('查询失败'))
    }
  }
}

module.exports = new PicksController()
