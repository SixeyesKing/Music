const logger = require('../utils/logger')

let song_url_v1, search

try {
  const api = require('NeteaseCloudMusicApi')
  song_url_v1 = api.song_url_v1
  search = api.search
} catch {
  logger.warn('NeteaseCloudMusicApi not available')
}

class NeteaseService {
  async getSongUrl(neteaseId) {
    if (!song_url_v1) return null
    try {
      const result = await song_url_v1({ id: String(neteaseId), level: 'standard' })
      if (result.body && result.body.data && result.body.data[0]) {
        return result.body.data[0].url
      }
      return null
    } catch (error) {
      logger.error('NeteaseService.getSongUrl error', { neteaseId, error: error.message })
      return null
    }
  }

  async searchSong(keyword, limit = 5) {
    if (!search) return []
    try {
      const result = await search({ keywords: keyword, type: 1, limit })
      if (result.body && result.body.result && result.body.result.songs) {
        return result.body.result.songs.map(s => ({
          neteaseId: s.id,
          title: s.name,
          artist: s.artists?.map(a => a.name).join('/') || '',
          album: s.album?.name || '',
          duration: Math.floor((s.duration || 0) / 1000)
        }))
      }
      return []
    } catch (error) {
      logger.error('NeteaseService.searchSong error', { keyword, error: error.message })
      return []
    }
  }
}

module.exports = new NeteaseService()
