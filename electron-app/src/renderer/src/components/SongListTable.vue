<template>
  <div class="song-list-table">
    <!-- 表头 -->
    <div class="table-header">
      <span class="col-index">#</span>
      <span class="col-song">歌曲</span>
      <span class="col-artist">歌手</span>
      <span class="col-album">专辑</span>
      <span class="col-duration">时长</span>
    </div>

    <!-- 歌曲行 -->
    <div
      v-for="(song, index) in songs"
      :key="song.id"
      class="table-row"
      :class="{
        'is-active': activeSongId === song.id,
        'is-even': index % 2 === 0
      }"
      @click="handleClick(song)"
      @dblclick="handleClick(song)"
    >
      <!-- 序号 -->
      <span
        class="col-index"
        :class="{
          'is-top': index < 3,
          'is-current': isCurrent(song),
          'is-playing': isCurrent(song) && isPlaying
        }"
        @click="handleClick(song)"
      >
        <span class="idx-num">{{ index + 1 }}</span>
        <Icon class="idx-hover-icon" icon="material-symbols:play-arrow-rounded" />
        <Icon class="idx-paused-icon" icon="material-symbols:play-arrow-rounded" />
        <span class="idx-wave">
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
        </span>
      </span>

      <!-- 歌曲信息 -->
      <div class="col-song">
        <div class="song-cover">
          <el-image
            :src="res.r(song.cover_url)"
            fit="cover"
            class="cover-img"
            lazy
          >
            <template #error>
              <div class="cover-fallback">
                <el-icon><Headset /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="cover-play-overlay">
            <Icon icon="material-symbols:play-arrow-rounded" />
          </div>
        </div>
        <div class="song-info">
          <span class="song-title" :class="{ 'is-playing': activeSongId === song.id }">
            {{ song.title }}
          </span>
        </div>
      </div>

      <!-- 歌手 -->
      <span class="col-artist">
        {{ song.artist || '未知歌手' }}
      </span>

      <!-- 专辑 -->
      <span class="col-album">
        {{ song.album || '未知专辑' }}
      </span>

      <!-- 时长 -->
      <span class="col-duration">
        {{ formatDuration(song.duration) }}
      </span>
    </div>

    <!-- 空状态 -->
    <div v-if="songs.length === 0" class="empty-state">
      <el-icon class="empty-icon"><Document /></el-icon>
      <p class="empty-text">暂无歌曲</p>
      <p class="empty-sub">点击上方「播放全部」添加歌曲吧</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDuration } from '../utils/format'
import { usePlayer } from '../composables/usePlayer'
import res from '../utils/resource_utils'

const props = defineProps({
  songs: {
    type: Array,
    default: () => []
  },
  activeSongId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['play'])

const { isPlaying, currentSong, togglePlay } = usePlayer()

function isCurrent(song) {
  return currentSong.value?.id === song.id
}

function handleClick(song) {
  if (isCurrent(song)) {
    togglePlay()
  } else {
    emit('play', song)
  }
}
</script>

<style scoped>
/* ===== 容器 ===== */
.song-list-table {
  margin-top: 4px;
}

/* ===== 表头 ===== */
.table-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  font-size: 12px;
  color: #999;
  border-bottom: 1px solid #eee;
}
.dark .table-header {
  color: #777;
  border-bottom-color: #2a2a2a;
}

/* ===== 行 ===== */
.table-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
}
.table-row.is-even {
  background: #fafafa;
}
.dark .table-row.is-even {
  background: #1e1e1e;
}
.table-row:hover {
  background: #f0f1f3;
}
.dark .table-row:hover {
  background: #252528;
}
.table-row.is-active {
  background: #fef0f0;
}
.dark .table-row.is-active {
  background: #2a1a1c;
}

/* ===== 列宽 ===== */
.col-index {
  width: 44px;
  text-align: center;
  flex-shrink: 0;
  font-size: 13px;
  color: #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}
.col-index.is-top .idx-num {
  color: #fc3641;
  font-weight: 600;
}

/* 序号数字 — 默认可见 */
.idx-num {
  display: inline;
}
.table-row:hover .idx-num,
.col-index.is-current .idx-num {
  display: none;
}

/* hover 播放图标 — 默认隐藏，hover 时显示 */
.idx-hover-icon {
  display: none;
  font-size: 18px;
  color: #555;
}
.table-row:hover .idx-hover-icon {
  display: inline-block;
}
.col-index.is-current .idx-hover-icon {
  display: none;
}
.dark .idx-hover-icon { color: #bbb; }

/* 暂停时播放图标 — 当前歌曲但未播放时显示 */
.idx-paused-icon {
  display: none;
  font-size: 18px;
  color: #fc3641;
}
.col-index.is-current:not(.is-playing) .idx-paused-icon {
  display: inline-block;
}

/* 音浪 — 当前歌曲且正在播放时显示 */
.idx-wave {
  display: none;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}
.col-index.is-current.is-playing .idx-wave {
  display: flex;
}
.wave-bar {
  width: 3px;
  background: #fc3641;
  border-radius: 1px;
  animation: sound-wave 0.5s ease-in-out infinite alternate;
}
.wave-bar:nth-child(1) { animation-delay: 0s; }
.wave-bar:nth-child(2) { animation-delay: 0.12s; }
.wave-bar:nth-child(3) { animation-delay: 0.24s; }
.wave-bar:nth-child(4) { animation-delay: 0.06s; }

@keyframes sound-wave {
  from { height: 4px; }
  to { height: 16px; }
}

.col-song {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.col-artist {
  width: 160px;
  flex-shrink: 0;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
}
.dark .col-artist {
  color: #aaa;
}
.col-album {
  width: 160px;
  flex-shrink: 0;
  font-size: 13px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
}
.dark .col-album {
  color: #777;
}
.col-duration {
  width: 64px;
  flex-shrink: 0;
  text-align: right;
  font-size: 12px;
  color: #aaa;
  font-variant-numeric: tabular-nums;
}
.dark .col-duration {
  color: #777;
}

/* ===== 歌曲封面 ===== */
.song-cover {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}
.cover-img {
  width: 100%;
  height: 100%;
  display: block;
}
.cover-fallback {
  width: 100%;
  height: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 18px;
}
.dark .cover-fallback {
  background: #2a2a2a;
  color: #555;
}
.cover-play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  opacity: 0;
  transition: opacity 0.15s;
}
.table-row:hover .cover-play-overlay {
  opacity: 1;
}

/* ===== 歌曲信息 ===== */
.song-info {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.song-title {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .song-title {
  color: #ddd;
}
.song-title.is-playing {
  color: #fc3641;
  font-weight: 500;
}
/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #ccc;
}
.dark .empty-state {
  color: #555;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0 0 4px 0;
}
.empty-sub {
  font-size: 12px;
  color: #ccc;
  margin: 0;
}
</style>
