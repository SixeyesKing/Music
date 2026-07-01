<template>
  <div class="recent-view h-full overflow-y-auto px-10 pt-6 pb-10">
    <div class="section-header">
      <h2 class="section-title">最近播放</h2>
      <span class="section-count">共 {{ list.length }} 首</span>
    </div>
    <div v-if="list.length === 0" class="empty-wrap">
      <Icon icon="material-symbols:history-rounded" class="text-5xl text-[#ddd] mb-3" />
      <p class="text-sm text-[#999]">暂无播放记录</p>
      <p class="text-xs text-[#ccc] mt-1">去歌单里听听音乐吧</p>
    </div>
    <div v-else class="recent-table">
      <div class="rt-row" v-for="(song, i) in list" :key="song.id" @click="playIt(song)">
        <span class="rt-idx">{{ i + 1 }}</span>
        <el-image :src="res.r(song.cover_url)" fit="cover" class="rt-cover" lazy>
          <template #error><div class="rt-cover-fb"><Icon icon="material-symbols:music-note-rounded" /></div></template>
        </el-image>
        <div class="rt-info">
          <span class="rt-title">{{ song.title }}</span>
          <span class="rt-meta">{{ song.artist }} · {{ song.album || '未知专辑' }}</span>
        </div>
        <span class="rt-duration">{{ formatDuration(song.duration) }}</span>
        <span class="rt-time">{{ song.playedAt || '刚刚' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlayer } from '../composables/usePlayer'
import { formatDuration } from '../utils/format'
import res from '../utils/resource_utils'

const { play: playSong } = usePlayer()
const list = ref([])
const RECENT_KEY = 'music_recent_plays'

onMounted(() => {
  try {
    list.value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch { list.value = [] }
})

function playIt(song) {
  playSong(song, list.value)
}
</script>

<style scoped>
.recent-view { background: #fff; }
.dark .recent-view { background: #191919; }

.section-header {
  display: flex; align-items: baseline; justify-content: space-between;
  padding-bottom: 14px; margin-bottom: 8px;
  border-bottom: 2px solid #fc3641;
}
.section-title { font-size: 20px; font-weight: 700; color: #333; margin: 0; }
.dark .section-title { color: #eee; }
.section-count { font-size: 13px; color: #999; }

.empty-wrap { display: flex; flex-direction: column; align-items: center; padding: 80px 0; }

.recent-table { display: flex; flex-direction: column; }
.rt-row {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 8px; border-radius: 6px; cursor: pointer;
  transition: background 0.15s;
}
.rt-row:hover { background: #f5f5f5; }
.dark .rt-row:hover { background: #252528; }
.rt-idx { width: 28px; text-align: center; font-size: 13px; color: #bbb; flex-shrink: 0; }
.rt-cover { width: 44px; height: 44px; border-radius: 4px; flex-shrink: 0; }
.rt-cover-fb {
  width: 100%; height: 100%; background: #e8e8e8;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 20px;
}
.dark .rt-cover-fb { background: #2a2a2a; }
.rt-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.rt-title { font-size: 14px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dark .rt-title { color: #ddd; }
.rt-meta { font-size: 12px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rt-duration { width: 48px; text-align: right; font-size: 12px; color: #aaa; font-variant-numeric: tabular-nums; }
.rt-time { width: 70px; text-align: right; font-size: 12px; color: #bbb; }
</style>
