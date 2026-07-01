<template>
  <div class="player-bar">
    <div class="progress-top" @click="seekByClick">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: currentSong ? progressPct + '%' : '0%' }"></div>
        <div class="progress-thumb" :style="{ left: currentSong ? progressPct + '%' : '0%' }"></div>
      </div>
    </div>

    <div v-if="!currentSong" class="player-empty">
      <div class="cover-wrap cover-empty">
        <Icon icon="material-symbols:headphones-rounded" />
      </div>
      <span class="empty-text">暂无播放</span>
    </div>

    <div v-else class="player-inner">
      <div class="player-left">
        <div class="cover-wrap" :class="{ 'is-spinning': isPlaying }">
          <img
            v-if="currentSong.cover_url"
            class="cover-img"
            :src="res.r(currentSong.cover_url)"
          />
          <div v-else class="cover-fb">
            <Icon icon="material-symbols:music-note-rounded" />
          </div>
        </div>
        <div class="song-info">
          <span class="song-title">{{ currentSong.title }}</span>
          <span class="song-artist">{{ currentSong.artist }}</span>
        </div>
        <Icon
          class="like-btn"
          :class="{ 'is-liked': liked }"
          :icon="liked ? 'mdi:heart' : 'mdi:heart-outline'"
          @click="handleLike"
        />
      </div>

      <div class="player-center">
        <Icon class="ctrl-icon" icon="material-symbols:skip-previous-rounded" @click="playPrev" />
        <div class="play-btn" @click="togglePlay">
          <Icon v-if="isPlaying" class="play-btn-icon" icon="material-symbols:pause-rounded" />
          <Icon v-else class="play-btn-icon" icon="material-symbols:play-arrow-rounded" />
        </div>
        <Icon class="ctrl-icon" icon="material-symbols:skip-next-rounded" @click="playNext" />
      </div>

      <div class="player-right">
        <span class="time-display">{{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}</span>
        <Icon
          class="right-icon"
          :icon="volume === 0 ? 'material-symbols:volume-off-rounded' : 'material-symbols:volume-up-rounded'"
          @click="toggleMute"
        />
        <el-slider
          class="vol-slider"
          :model-value="volume * 100"
          :max="100"
          :show-tooltip="false"
          size="small"
          @input="v => setVolume(v / 100)"
        />
        <el-popover
          trigger="click"
          placement="top"
          :width="260"
          :offset="12"
          popper-class="playlist-popover"
        >
          <template #reference>
            <Icon class="right-icon" icon="material-symbols:queue-music-rounded" />
          </template>
          <div class="playlist-pop">
            <div class="playlist-pop-title">播放列表 ({{ playlist.length }})</div>
            <div class="playlist-pop-list">
              <div
                v-for="(s, i) in playlist"
                :key="s.id"
                class="playlist-pop-item"
                :class="{ 'is-current': s.id === currentSong.id }"
                @click="play(s, playlist)"
              >
                <span class="pop-idx">{{ i + 1 }}</span>
                <span class="pop-title">{{ s.title }}</span>
                <span class="pop-artist">{{ s.artist }}</span>
              </div>
              <div v-if="playlist.length === 0" class="playlist-pop-empty">播放列表为空</div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayer } from '../composables/usePlayer'
import { formatDuration } from '../utils/format'
import { addFavorite, removeFavorite, getFavorites } from '../api/apiMusic'
import res from '../utils/resource_utils'

const {
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  playlist,
  play,
  togglePlay,
  playNext,
  playPrev,
  seek,
  setVolume
} = usePlayer()

const liked = ref(false)
const likeLoading = ref(false)

watch(currentSong, async (song) => {
  if (!song) { liked.value = false; return }
  try {
    const favs = await getFavorites(1, 200) || []
    liked.value = favs.some(f => f.id === song.id)
  } catch { liked.value = false }
})
let lastVolume = 0.7

const progressPct = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

async function handleLike() {
  if (likeLoading.value || !currentSong.value) return
  likeLoading.value = true
  try {
    if (liked.value) {
      await removeFavorite(currentSong.value.id)
      liked.value = false
    } else {
      await addFavorite(currentSong.value.id)
      liked.value = true
    }
  } catch {
    // ignore
  } finally {
    likeLoading.value = false
  }
}

function toggleMute() {
  if (volume.value > 0) {
    lastVolume = volume.value
    setVolume(0)
  } else {
    setVolume(lastVolume)
  }
}

function seekByClick(e) {
  if (!currentSong.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  seek(pct * duration.value)
}
</script>

<style scoped>
.player-bar {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e6e8;
  user-select: none;
}
.dark .player-bar { border-top-color: #27272e; }

.progress-top {
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 3px;
  cursor: pointer;
  z-index: 2;
}
.progress-track {
  position: relative;
  width: 100%; height: 100%;
  background: #e8e8e8;
}
.dark .progress-track { background: #3a3a3a; }
.progress-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  background: #fc3641;
  border-radius: 0 1px 1px 0;
}
.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px; height: 8px;
  background: #fc3641;
  border-radius: 50%;
  opacity: 0;
}
.progress-top:hover .progress-thumb { opacity: 1; }

.player-empty {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding: 0 20px;
}
.cover-empty {
  border: 2px dashed #ddd;
  display: flex; align-items: center; justify-content: center;
  color: #ccc; font-size: 22px;
}
.dark .cover-empty { border-color: #3a3a3a; }
.empty-text { font-size: 13px; color: #bbb; }

.player-inner {
  display: flex; align-items: center;
  height: 100%;
  padding: 0 20px;
  gap: 32px;
}

.player-left {
  display: flex; align-items: center; gap: 12px;
  width: 220px; flex-shrink: 0; min-width: 0;
}
.cover-wrap {
  width: 46px; height: 46px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2.5px solid rgba(0,0,0,0.08);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.06);
}
.dark .cover-wrap {
  border-color: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04);
}
.cover-wrap.is-spinning {
  animation: spin 14s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-fb {
  width: 100%; height: 100%;
  background: #e8e8e8;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 22px;
}
.dark .cover-fb { background: #2a2a2a; }

.song-info {
  min-width: 0; display: flex; flex-direction: column; gap: 2px;
}
.song-title {
  font-size: 13px; color: #333; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  cursor: default;
}
.dark .song-title { color: #d4d4d6; }
.song-title:hover { color: #333; }
.song-artist {
  font-size: 11px; color: #999;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.like-btn {
  font-size: 18px; color: #ddd;
  cursor: pointer; flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}
.like-btn:hover { color: #fc3641; transform: scale(1.1); }
.like-btn.is-liked { color: #fc3641; }

.player-center {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  gap: 18px;
}
.ctrl-icon {
  font-size: 24px; color: #666;
  cursor: pointer;
  transition: color 0.15s;
}
.dark .ctrl-icon { color: #bbb; }
.ctrl-icon:hover { color: #333; }
.dark .ctrl-icon:hover { color: #fff; }

.play-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #fc3641;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.15s;
}
.play-btn:hover { transform: scale(1.08); }
.play-btn-icon {
  font-size: 22px; color: #fff;
  margin-left: 2px;
}

.player-right {
  display: flex; align-items: center;
  gap: 10px;
  width: 230px; flex-shrink: 0;
  justify-content: flex-end;
}
.time-display {
  font-size: 11px; color: #999;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.right-icon {
  font-size: 19px; color: #999;
  cursor: pointer;
  transition: color 0.15s;
  flex-shrink: 0;
}
.right-icon:hover { color: #555; }
.dark .right-icon:hover { color: #ccc; }
.vol-slider { width: 70px; }
</style>

<style>
.playlist-popover { padding: 12px !important; border-radius: 8px !important; }
.playlist-pop { max-height: 320px; display: flex; flex-direction: column; }
.playlist-pop-title {
  font-size: 13px; font-weight: 600;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #eee;
  color: #333;
}
.playlist-pop-list { overflow-y: auto; flex: 1; }
.playlist-pop-item {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 6px;
  font-size: 13px; cursor: pointer;
  border-radius: 4px;
}
.playlist-pop-item:hover { background: #f0f0f0; }
.playlist-pop-item.is-current { color: #fc3641; font-weight: 500; }
.pop-idx { width: 22px; text-align: center; color: #ccc; font-size: 12px; flex-shrink: 0; }
.pop-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pop-artist {
  color: #999; font-size: 11px; max-width: 80px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.playlist-pop-empty { padding: 16px; text-align: center; color: #ccc; font-size: 13px; }
</style>
