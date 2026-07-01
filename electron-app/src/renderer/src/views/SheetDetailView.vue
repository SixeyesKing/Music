<template>
  <div
    class="sheet-detail-view h-full overflow-y-auto"
    v-infinite-scroll="onLoadMore"
    :infinite-scroll-disabled="!hasMore || loadingMore"
    infinite-scroll-distance="100"
  >
    <!-- 加载态 -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <el-icon class="text-3xl text-primary animate-spin"><Loading /></el-icon>
    </div>

    <!-- 错误态 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center h-64 gap-4">
      <el-icon class="text-4xl text-on-secondary"><WarningFilled /></el-icon>
      <p class="text-sm text-on-secondary dark:text-dark-on-secondary">{{ error }}</p>
      <el-button size="small" @click="loadDetail(sheetId)">重试</el-button>
    </div>

    <!-- 正常内容 -->
    <template v-else-if="sheet">
      <!-- 歌单头部 - 网易云风格 -->
      <div class="sheet-header">
        <!-- 模糊背景层 -->
        <div class="header-bg">
          <div class="header-bg-mask" :style="headerBgStyle"></div>
          <div class="header-bg-overlay"></div>
        </div>

        <!-- 内容区 -->
        <div class="header-content">
          <!-- 封面 -->
          <div class="cover-wrapper">
            <el-image
              class="cover-img"
              :src="res.r(sheet.icon)"
              fit="cover"
            >
              <template #error>
                <div class="cover-fallback">
                  <el-icon class="text-5xl text-on-secondary"><Headset /></el-icon>
                </div>
              </template>
            </el-image>
            <!-- 播放量角标 -->
            <div class="cover-badge">
              <el-icon><Headset /></el-icon>
              <span>{{ formatNumber(sheet.clicksCount) }}</span>
            </div>
          </div>

          <!-- 信息区 -->
          <div class="info-area">
            <!-- 标题 -->
            <h1 class="sheet-title">{{ sheet.title }}</h1>

            <!-- 创建者 & 时间 -->
            <div class="creator-row">
              <div class="creator-avatar">
                <el-icon><User /></el-icon>
              </div>
              <span class="creator-name">{{ sheet.creator || '署前街少年' }}</span>
              <span class="create-time">{{ sheet.created || '2024-01-15' }} 创建</span>
            </div>

            <!-- 标签 -->
            <div class="tags-row" v-if="sheet.tags && sheet.tags.length">
              <span
                v-for="tag in sheet.tags"
                :key="tag"
                class="tag-chip"
              >{{ tag }}</span>
            </div>
            <!-- 默认标签 -->
            <div class="tags-row" v-else>
              <span class="tag-chip">音乐</span>
            </div>

            <!-- 描述 -->
            <p v-if="sheet.detail" class="sheet-desc" :class="{ 'is-expanded': descExpanded }">
              {{ sheet.detail }}
            </p>
            <span
              v-if="sheet.detail && sheet.detail.length > 80"
              class="desc-toggle"
              @click="descExpanded = !descExpanded"
            >
              {{ descExpanded ? '收起' : '展开' }}
            </span>

            <!-- 操作按钮组 -->
            <div class="action-row">
              <button class="btn-play" @click="playAll">
                <el-icon class="btn-play-icon"><CaretRight /></el-icon>
                播放全部
              </button>
              <button
                class="btn-action"
                :class="{ 'is-active': isCollected }"
                :disabled="collectLoading"
                @click="handleCollect"
              >
                <el-icon v-if="!collectLoading">
                  <StarFilled v-if="isCollected" />
                  <FolderAdd v-else />
                </el-icon>
                <el-icon v-else class="animate-spin"><Loading /></el-icon>
                收藏{{ isCollected ? '(' + formatNumber(sheet.collectsCount) + ')' : '' }}
              </button>
              <button class="btn-action" @click="handleShare">
                <el-icon><Share /></el-icon>
                分享
              </button>
              <button class="btn-action" @click="handleDownload">
                <el-icon><Download /></el-icon>
                下载全部
              </button>
              <button class="btn-action btn-more">
                <el-icon><MoreFilled /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签栏: 歌曲列表 + 评论 -->
      <div class="section-tabs">
        <div class="section-tab active">
          歌曲列表
          <span class="tab-count">{{ songs.length }}</span>
        </div>
        <div class="section-tab">
          评论
          <span class="tab-count">{{ sheet.commentsCount || 0 }}</span>
        </div>
        <div class="section-tab">
          收藏者
          <span class="tab-count">{{ sheet.collectsCount || 0 }}</span>
        </div>
      </div>

      <!-- 歌曲列表 -->
      <div class="song-list-section">
        <SongListTable
          :songs="songs"
          :active-song-id="currentSong?.id"
          @play="onPlaySong"
        />
        <!-- 加载更多指示器 -->
        <div v-if="loadingMore" class="load-more">
          <el-icon class="animate-spin"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div v-else-if="!hasMore && songs.length > 0" class="load-more no-more">
          没有更多了
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SongListTable from '../components/SongListTable.vue'
import res from '../utils/resource_utils'
import { useSheetDetail } from '../composables/useSheetDetail'
import { usePlayer } from '../composables/usePlayer'
import { isSheetCollected, collectSheet, removeCollectedSheet } from '../api/apiSheet'
import { formatNumber } from '../utils/format'

const {
  sheet,
  songs,
  loading,
  error,
  collectLoading,
  sheetId,
  hasMore,
  loadingMore,
  loadDetail,
  loadMoreSongs,
  handleCollect: doCollect
} = useSheetDetail()

const { play: playSong, currentSong } = usePlayer()

const isCollected = ref(false)
const descExpanded = ref(false)

watch(sheetId, async (id) => {
  if (!id) return
  try {
    isCollected.value = await isSheetCollected(id)
  } catch { isCollected.value = false }
})

async function handleCollect() {
  if (collectLoading.value) return
  if (isCollected.value) {
    try {
      await removeCollectedSheet(sheetId.value)
      isCollected.value = false
      if (sheet.value) sheet.value.collectsCount = Math.max(0, (sheet.value.collectsCount || 1) - 1)
    } catch { /* ignore */ }
  } else {
    await doCollect()
    isCollected.value = true
  }
}

const headerBgStyle = computed(() => {
  if (!sheet.value) return {}
  const imgUrl = res.r(sheet.value.icon)
  return { backgroundImage: `url(${imgUrl})` }
})

function playAll() {
  if (songs.value.length > 0) {
    playSong(songs.value[0], songs.value)
  }
}

function onPlaySong(song) {
  playSong(song, songs.value)
}

function onLoadMore() {
  loadMoreSongs()
}

function handleShare() {
  console.log('分享歌单')
}

function handleDownload() {
  console.log('下载全部')
}
</script>

<style scoped>
/* ===== 歌单头部 ===== */
.sheet-header {
  position: relative;
  padding: 30px 40px 28px 40px;
  overflow: hidden;
}

/* 模糊背景 */
.header-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.header-bg-mask {
  position: absolute;
  inset: -60px;
  background-size: cover;
  background-position: center;
  filter: blur(60px) brightness(0.75) saturate(1.6);
  transform: scale(1.1);
}
.header-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.15)
  );
}
.dark .header-bg-mask {
  filter: blur(60px) brightness(0.5) saturate(1.3);
}
.dark .header-bg-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.5)
  );
}

/* 内容区 */
.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* 封面 */
.cover-wrapper {
  position: relative;
  flex-shrink: 0;
}
.cover-img {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  display: block;
}
.cover-fallback {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  font-size: 11px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(6px);
}

/* 信息区 */
.info-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 0;
}

.sheet-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin: 0;
}

/* 创建者 */
.creator-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.creator-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}
.creator-name {
  font-size: 13px;
  color: rgba(255,255,255,0.85);
}
.create-time {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}
.create-time::before {
  content: '';
  display: inline-block;
  width: 1px;
  height: 10px;
  background: rgba(255,255,255,0.3);
  margin-right: 8px;
  vertical-align: middle;
}

/* 标签 */
.tags-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  white-space: nowrap;
}

/* 描述 */
.sheet-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sheet-desc.is-expanded {
  display: block;
}
.desc-toggle {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  user-select: none;
}
.desc-toggle:hover {
  color: rgba(255,255,255,0.9);
}

/* 操作按钮 */
.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.btn-play {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #fc3641;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-play:hover {
  background: #e02d37;
}
.btn-play-icon {
  font-size: 18px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 18px;
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-action:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.btn-action.is-active {
  color: #fc3641;
  background: rgba(252, 54, 65, 0.12);
  border-color: rgba(252, 54, 65, 0.3);
}
.btn-more {
  width: 36px;
  padding: 8px;
  justify-content: center;
}

/* ===== 分区标签 ===== */
.section-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 40px;
  border-bottom: 2px solid #e8e8e8;
  margin-top: -1px;
  position: relative;
  z-index: 2;
  background: #fff;
}
.dark .section-tabs {
  background: #191919;
  border-bottom-color: #2a2a2a;
}
.section-tab {
  padding: 14px 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.section-tab:hover {
  color: #333;
}
.dark .section-tab:hover {
  color: #ddd;
}
.section-tab.active {
  color: #333;
  font-weight: 600;
  border-bottom-color: #fc3641;
}
.dark .section-tab.active {
  color: #eee;
}
.tab-count {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}

/* ===== 歌曲列表 ===== */
.song-list-section {
  padding: 0 40px 40px 40px;
  background: #fff;
}
.dark .song-list-section {
  background: #191919;
}

/* 加载更多 */
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 0 8px 0;
  font-size: 13px;
  color: #999;
}
.load-more.no-more {
  color: #ccc;
}

/* 滚动条微调 */
.sheet-detail-view::-webkit-scrollbar {
  width: 6px;
}
.sheet-detail-view::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
}
</style>
