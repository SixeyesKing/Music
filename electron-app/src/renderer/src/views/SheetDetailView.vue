<template>
  <div class="sheet-detail-view h-full overflow-y-auto">
    <!-- 加载态 -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <el-icon class="text-3xl text-primary animate-spin"><Loading /></el-icon>
    </div>

    <!-- 错误态 -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center h-64 gap-4"
    >
      <el-icon class="text-4xl text-on-secondary"><WarningFilled /></el-icon>
      <p class="text-sm text-on-secondary dark:text-dark-on-secondary">{{ error }}</p>
      <el-button size="small" @click="loadDetail(sheetId)">重试</el-button>
    </div>

    <!-- 正常内容 -->
    <template v-else-if="sheet">
      <!-- 歌单头部 -->
      <div class="sheet-header flex gap-8 mb-8">
        <!-- 封面 -->
        <div class="shrink-0">
          <el-image
            class="w-52 h-52 rounded-lg shadow-lg"
            :src="res.r(sheet.icon)"
            fit="cover"
          >
            <template #error>
              <div
                class="w-full h-full bg-surface dark:bg-dark-surface rounded-lg flex items-center justify-center"
              >
                <el-icon class="text-4xl text-on-secondary"><Headset /></el-icon>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 信息区 -->
        <div class="flex flex-col justify-between flex-1 min-w-0 py-1">
          <!-- 标题行 -->
          <div>
            <h1 class="text-2xl font-bold text-on-surface dark:text-dark-on-surface mb-3">
              {{ sheet.title }}
            </h1>
            <!-- 描述 -->
            <p
              v-if="sheet.detail"
              class="text-sm text-on-secondary dark:text-dark-on-secondary leading-relaxed line-clamp-3"
            >
              {{ sheet.detail }}
            </p>
          </div>

          <!-- 统计与操作 -->
          <div class="mt-4">
            <!-- 统计数据 -->
            <div class="flex items-center gap-6 text-xs text-on-secondary dark:text-dark-on-secondary mb-4">
              <span>歌曲 {{ sheet.songsCount ?? songs.length }}</span>
              <span>播放 {{ formatNumber(sheet.clicksCount) }}</span>
              <span>收藏 {{ formatNumber(sheet.collectsCount) }}</span>
              <span>评论 {{ formatNumber(sheet.commentsCount) }}</span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-3">
              <el-button
                type="primary"
                size="small"
                @click="playAll"
              >
                <el-icon><CaretRight /></el-icon>
                播放全部
              </el-button>
              <el-button
                size="small"
                :loading="collectLoading"
                @click="handleCollect"
              >
                <el-icon v-if="!collectLoading"><Star /></el-icon>
                收藏 ({{ formatNumber(sheet.collectsCount) }})
              </el-button>
              <el-button size="small">
                <el-icon><Share /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 歌曲列表 -->
      <div class="song-list-section">
        <SongListTable
          :songs="songs"
          @play="onPlaySong"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import SongListTable from '../components/SongListTable.vue'
import res from '../utils/resource_utils'
import { useSheetDetail } from '../composables/useSheetDetail'
import { formatNumber } from '../utils/format'

const {
  sheet,
  songs,
  loading,
  error,
  collectLoading,
  sheetId,
  loadDetail,
  handleCollect
} = useSheetDetail()

function playAll() {
  if (songs.value.length > 0) {
    onPlaySong(songs.value[0])
  }
}

function onPlaySong(song) {
  // 后续可接入全局播放器
  console.log('播放歌曲:', song.title, song.url)
}
</script>

<style scoped>
.sheet-detail-view {
  padding: 32px 40px 40px 40px;
}

.song-list-section {
  margin-top: 32px;
}
</style>
