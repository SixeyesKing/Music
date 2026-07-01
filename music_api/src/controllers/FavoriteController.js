const db = require('../database/connection')
const ResponseHelper = require('../utils/response')
const logger = require('../utils/logger')

class FavoriteController {
  async getFavorites(req, res) {
    try {
      const { page = 1, pageSize = 50 } = req.query
      const userId = '1'
      const offset = (page - 1) * pageSize
      const rows = await db.query(
        `SELECT m.*, f.created as fav_created
         FROM t_user_favorite f
         JOIN music m ON m.id = f.song_id
         WHERE f.user_id = ?
         ORDER BY f.created DESC LIMIT ? OFFSET ?`,
        [userId, parseInt(pageSize), offset]
      )
      res.json(ResponseHelper.success(rows, '查询成功'))
    } catch (error) {
      logger.error('getFavorites error', { error: error.message })
      res.status(500).json(ResponseHelper.error('查询失败'))
    }
  }

  async addFavorite(req, res) {
    try {
      const { songId } = req.body
      const userId = '1'
      if (!songId) {
        return res.status(400).json(ResponseHelper.badRequest('缺少 songId'))
      }
      // 检查歌曲存在
      const [song] = await db.query('SELECT id FROM music WHERE id = ?', [songId])
      if (!song) {
        return res.status(404).json(ResponseHelper.notFound('歌曲不存在'))
      }
      // 插入或忽略重复
      await db.query(
        'INSERT IGNORE INTO t_user_favorite (user_id, song_id) VALUES (?, ?)',
        [userId, songId]
      )
      // 更新 like_count
      await db.query('UPDATE music SET like_count = like_count + 1 WHERE id = ?', [songId])
      res.json(ResponseHelper.success(null, '收藏成功'))
    } catch (error) {
      logger.error('addFavorite error', { error: error.message })
      res.status(500).json(ResponseHelper.error('收藏失败'))
    }
  }

  async removeFavorite(req, res) {
    try {
      const { songId } = req.params
      const userId = '1'
      const result = await db.query(
        'DELETE FROM t_user_favorite WHERE user_id = ? AND song_id = ?',
        [userId, songId]
      )
      if (result.affectedRows > 0) {
        await db.query('UPDATE music SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?', [songId])
      }
      res.json(ResponseHelper.success(null, '取消收藏'))
    } catch (error) {
      logger.error('removeFavorite error', { error: error.message })
      res.status(500).json(ResponseHelper.error('取消收藏失败'))
    }
  }
}

module.exports = new FavoriteController()
