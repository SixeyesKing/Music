import { get, post, del } from '../utils/request'

export async function getMusicList(page = 1, pageSize = 20) {
    return get('/music', { page, pageSize })
}

export async function likeMusic(id) {
    return post(`/music/${id}/like`)
}

export async function getSongStreamUrl(id) {
    const data = await get(`/music/${id}/url`)
    return data.url
}

export async function getFavorites(page = 1, pageSize = 50) {
    return get('/favorites', { page, pageSize })
}

export async function addFavorite(songId) {
    return post('/favorites', { songId })
}

export async function removeFavorite(songId) {
    return del(`/favorites/${songId}`)
}
