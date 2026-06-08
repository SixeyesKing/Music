<template>
  <div class="song-list-table">
    <div
      class="flex items-center gap-4 px-4 py-2 text-xs text-on-secondary dark:text-dark-on-secondary border-b border-outline dark:border-dark-outline"
    >
      <span class="w-8 text-center">#</span>
      <span class="flex-1">歌曲</span>
      <span class="w-48">专辑</span>
      <span class="w-24 text-right">时长</span>
    </div>
    <div
      v-for="(song, index) in songs"
      :key="song.id"
      class="flex items-center gap-4 px-4 py-2 cursor-pointer transition-colors hover:bg-hover dark:hover:bg-dark-hover border-b border-outline/50 dark:border-dark-outline/50"
      :class="{ 'bg-primary/5 dark:bg-dark-primary/10': activeSongId === song.id }"
      @click="$emit('play', song)"
      @dblclick="$emit('play', song)"
    >
      <span class="w-8 text-center text-xs text-on-secondary dark:text-dark-on-secondary">
        {{ index + 1 }}
      </span>
      <div class="flex-1 flex items-center gap-3 min-w-0">
        <el-image
          class="w-10 h-10 rounded-sm shrink-0"
          :src="res.r(song.cover_url)"
          fit="cover"
          lazy
        >
          <template #error>
            <div class="w-full h-full bg-surface dark:bg-dark-surface flex items-center justify-center">
              <el-icon><Headset /></el-icon>
            </div>
          </template>
        </el-image>
        <div class="min-w-0">
          <div class="text-sm truncate text-on-surface dark:text-dark-on-surface">
            {{ song.title }}
          </div>
          <div class="text-xs text-on-secondary dark:text-dark-on-secondary truncate">
            {{ song.artist }}
          </div>
        </div>
      </div>
      <span class="w-48 text-xs text-on-secondary dark:text-dark-on-secondary truncate">
        {{ song.album || '未知专辑' }}
      </span>
      <span class="w-24 text-right text-xs text-on-secondary dark:text-dark-on-secondary tabular-nums">
        {{ formatDuration(song.duration) }}
      </span>
    </div>
    <div v-if="songs.length === 0" class="py-16 text-center text-on-secondary dark:text-dark-on-secondary text-sm">
      暂无歌曲
    </div>
  </div>
</template>

<script setup>
import { formatDuration } from '../utils/format'
import res from '../utils/resource_utils'

defineProps({
  songs: {
    type: Array,
    default: () => []
  },
  activeSongId: {
    type: [String, Number],
    default: null
  }
})

defineEmits(['play'])
</script>
