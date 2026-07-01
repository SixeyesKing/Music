<template>
  <div class="collection-view h-full overflow-y-auto px-10 pt-6 pb-10">
    <h2 class="page-title mb-6">{{ $t('main.myCollection') }}</h2>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="收藏的歌曲" name="songs">
        <div v-if="favSongs.length === 0" class="empty-wrap">
          <Icon icon="material-symbols:favorite-outline-rounded" class="text-5xl text-[#ddd] mb-3" />
          <p class="text-sm text-[#999]">暂无收藏的歌曲</p>
          <p class="text-xs text-[#ccc] mt-1">在播放条点击爱心收藏喜欢的歌吧</p>
        </div>
        <div v-else>
          <div
            v-for="(song, i) in favSongs"
            :key="song.id"
            class="fav-row"
            @click="playIt(song)"
          >
            <span class="fav-idx">{{ i + 1 }}</span>
            <el-image :src="res.r(song.cover_url)" fit="cover" class="fav-cover" lazy>
              <template #error><div class="fav-cover-fb"><Icon icon="material-symbols:music-note-rounded" /></div></template>
            </el-image>
            <div class="fav-info">
              <span class="fav-title">{{ song.title }}</span>
              <span class="fav-meta">{{ song.artist }} · {{ song.album || '未知专辑' }}</span>
            </div>
            <span class="fav-duration">{{ formatDuration(song.duration) }}</span>
            <el-icon class="fav-del" @click.stop="unfav(song.id)"><Delete /></el-icon>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="收藏的歌单" name="sheets">
        <div v-if="collectedSheets.length === 0" class="empty-wrap">
          <Icon icon="material-symbols:library-music-outline-rounded" class="text-5xl text-[#ddd] mb-3" />
          <p class="text-sm text-[#999]">暂无收藏的歌单</p>
        </div>
        <div v-else class="card-grid">
          <div v-for="item in collectedSheets" :key="item.id" class="card-item" @click="goSheet(item.id)">
            <div class="card-cover">
              <el-image :src="res.r(item.icon)" fit="cover" class="card-img" lazy>
                <template #error><div class="card-fb"><Icon icon="material-symbols:music-note-rounded" /></div></template>
              </el-image>
              <div class="card-del" @click.stop="uncollectSheet(item.id)">
                <Icon icon="material-symbols:close-rounded" />
              </div>
            </div>
            <p class="card-title">{{ item.title }}</p>
            <p class="card-sub">{{ item.songsCount || 0 }} 首</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayer } from '../composables/usePlayer'
import { getFavorites, removeFavorite } from '../api/apiMusic'
import { getCollectedSheets, removeCollectedSheet } from '../api/apiSheet'
import { formatDuration } from '../utils/format'
import res from '../utils/resource_utils'

const router = useRouter()
const { play: playSong } = usePlayer()
const activeTab = ref('songs')
const favSongs = ref([])
const collectedSheets = ref([])

onMounted(async () => {
  try {
    favSongs.value = await getFavorites(1, 50) || []
  } catch { favSongs.value = [] }
  try {
    collectedSheets.value = await getCollectedSheets() || []
  } catch { collectedSheets.value = [] }
})

async function uncollectSheet(sheetId) {
  try {
    await removeCollectedSheet(sheetId)
    collectedSheets.value = collectedSheets.value.filter(s => s.id !== sheetId)
  } catch { /* ignore */ }
}

async function unfav(songId) {
  try {
    await removeFavorite(songId)
    favSongs.value = favSongs.value.filter(s => s.id !== songId)
  } catch { /* ignore */ }
}

function playIt(song) {
  playSong(song, favSongs.value)
}

function goSheet(id) {
  router.push(`/sheetDetail/${id}`)
}
</script>

<style scoped>
.collection-view { background: #fff; }
.dark .collection-view { background: #191919; }
.page-title { font-size: 22px; font-weight: 700; color: #333; margin: 0; }
.dark .page-title { color: #eee; }

.empty-wrap { display: flex; flex-direction: column; align-items: center; padding: 80px 0; }

/* 收藏歌曲列表 */
.fav-row {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 8px; border-radius: 6px; cursor: pointer;
  transition: background 0.15s;
}
.fav-row:hover { background: #f5f5f5; }
.dark .fav-row:hover { background: #252528; }
.fav-idx { width: 28px; text-align: center; font-size: 13px; color: #bbb; flex-shrink: 0; }
.fav-cover { width: 44px; height: 44px; border-radius: 4px; flex-shrink: 0; }
.fav-cover-fb {
  width: 100%; height: 100%; background: #e8e8e8;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 20px;
}
.dark .fav-cover-fb { background: #2a2a2a; }
.fav-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.fav-title { font-size: 14px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dark .fav-title { color: #ddd; }
.fav-meta { font-size: 12px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-duration { width: 48px; text-align: right; font-size: 12px; color: #aaa; font-variant-numeric: tabular-nums; }
.fav-del { font-size: 16px; color: #ccc; cursor: pointer; transition: color 0.15s; }
.fav-del:hover { color: #fc3641; }

/* 歌单卡片 */
.card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 16px; }
.card-item { cursor: pointer; }
.card-cover {
  position: relative; width: 100%; padding-bottom: 100%;
  border-radius: 8px; overflow: hidden; margin-bottom: 8px;
}
.card-img { position: absolute; inset: 0; width: 100%; height: 100%; }
.card-fb {
  position: absolute; inset: 0; background: #e8e8e8;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 32px;
}
.dark .card-fb { background: #2a2a2a; }
.card-del {
  position: absolute; top: 4px; right: 4px; z-index: 5;
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 14px; opacity: 0; transition: opacity 0.2s;
}
.card-cover:hover .card-del { opacity: 1; }

.card-title { font-size: 13px; color: #333; margin: 0 0 4px 0; }
.dark .card-title { color: #ddd; }
.card-sub { font-size: 11px; color: #999; margin: 0; }
</style>
