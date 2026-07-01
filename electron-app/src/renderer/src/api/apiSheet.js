// apiSheet.js 关于歌单的接口
import { get, post, del } from '../utils/request'

// 查询歌单列表
export async function getSheetList(page = 1, pageSize = 20) {
    return get('/sheet', { page, pageSize })
}

// 查询歌单详情
export async function getSheetDetail(id) {
    return get(`/sheet/${id}`)
}

// 查询歌单下的歌曲列表
export async function getSheetSongs(id, page = 1, pageSize = 50) {
    return get(`/sheet/${id}/songs`, { page, pageSize })
}

// 点击歌单（增加点击次数）
export async function clickSheet(id) {
    return post(`/sheet/${id}/click`)
}

// 收藏歌单
export async function collectSheet(id) {
    return post(`/sheet/${id}/collect`)
}

// 获取收藏的歌单列表
export async function getCollectedSheets() {
    return get('/sheet/collected')
}

// 取消收藏歌单
export async function removeCollectedSheet(id) {
    return del(`/sheet/collected/${id}`)
}

// 检查歌单是否已收藏
export async function isSheetCollected(id) {
    const data = await get(`/sheet/${id}/isCollected`)
    return data.collected
}