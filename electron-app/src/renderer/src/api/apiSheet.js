// apiSheet.js 关于歌单的接口
import {get, post} from '../utils/request'

// 查询歌单列表
export async function getSheetList() {
    return get('/sheet')
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