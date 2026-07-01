<template>
  <div class="setting-view h-full overflow-hidden flex">
    <!-- 左侧导航 -->
    <div class="setting-nav">
      <div
        v-for="nav in navItems"
        :key="nav.key"
        class="nav-item"
        :class="{ 'is-active': activeNav === nav.key }"
        @click="activeNav = nav.key"
      >
        <Icon :icon="nav.icon" class="nav-icon" />
        <span>{{ nav.label }}</span>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="setting-content">
      <!-- 常规 -->
      <div v-if="activeNav === 'general'" class="setting-panel">
        <h3 class="panel-title">常规</h3>
        <div class="setting-row">
          <span class="setting-label">语言</span>
          <el-select v-model="selectedLanguage" size="default" style="width: 200px" @change="switchLanguage">
            <el-option v-for="opt in langOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </div>
        <div class="setting-row">
          <span class="setting-label">{{ t('setting.routine.themeMode') }}</span>
          <el-radio-group v-model="mode" @change="setMode">
            <el-radio value="system">{{ t('setting.routine.followSystem') }}</el-radio>
            <el-radio value="light">{{ t('setting.routine.light') }}</el-radio>
            <el-radio value="dark">{{ t('setting.routine.dark') }}</el-radio>
          </el-radio-group>
        </div>
        <div class="setting-row">
          <span class="setting-label">开机启动</span>
          <el-switch v-model="autoStart" />
        </div>
        <div class="setting-row">
          <span class="setting-label">关闭时最小化</span>
          <el-switch v-model="minimizeOnClose" />
        </div>
      </div>

      <!-- 播放 -->
      <div v-if="activeNav === 'playback'" class="setting-panel">
        <h3 class="panel-title">播放</h3>
        <div class="setting-row">
          <span class="setting-label">自动播放下一首</span>
          <el-switch v-model="autoNext" />
        </div>
        <div class="setting-row">
          <span class="setting-label">播放时淡入淡出</span>
          <el-switch v-model="crossfade" />
        </div>
        <div class="setting-row">
          <span class="setting-label">默认音量</span>
          <el-slider v-model="defaultVolume" :max="100" style="width: 160px" />
          <span class="setting-val">{{ defaultVolume }}%</span>
        </div>
      </div>

      <!-- 下载 -->
      <div v-if="activeNav === 'download'" class="setting-panel">
        <h3 class="panel-title">下载</h3>
        <div class="setting-row">
          <span class="setting-label">下载目录</span>
          <span class="setting-val text-[#999]">C:\Users\Music\Downloads</span>
          <el-button size="small">更改</el-button>
        </div>
        <div class="setting-row">
          <span class="setting-label">下载音质</span>
          <el-select v-model="downloadQuality" size="default" style="width: 140px">
            <el-option label="标准 (128kbps)" value="standard" />
            <el-option label="较高 (192kbps)" value="higher" />
            <el-option label="极高 (320kbps)" value="extreme" />
            <el-option label="无损 (FLAC)" value="lossless" />
          </el-select>
        </div>
      </div>

      <!-- 快捷键 -->
      <div v-if="activeNav === 'shortcuts'" class="setting-panel">
        <h3 class="panel-title">快捷键</h3>
        <div v-for="hk in shortcuts" :key="hk.action" class="setting-row">
          <span class="setting-label">{{ hk.label }}</span>
          <el-tag size="default" class="shortcut-tag">{{ hk.key }}</el-tag>
        </div>
      </div>

      <!-- 关于 -->
      <div v-if="activeNav === 'about'" class="setting-panel">
        <h3 class="panel-title">关于</h3>
        <div class="about-info">
          <p class="text-sm text-[#666] mb-1">Music Desktop v1.0.0</p>
          <p class="text-xs text-[#aaa]">基于 Electron + Vue 3 构建</p>
          <p class="text-xs text-[#aaa]">音乐数据来源于网易云音乐</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingView } from '../composables/useSettingView'
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { selectedLanguage, switchLanguage } = useSettingView()
const { mode, setMode } = useTheme()

const activeNav = ref('general')
const autoStart = ref(false)
const minimizeOnClose = ref(true)
const autoNext = ref(true)
const crossfade = ref(false)
const defaultVolume = ref(70)
const downloadQuality = ref('standard')

const navItems = [
  { key: 'general',  label: '常规', icon: 'material-symbols:settings-outline-rounded' },
  { key: 'playback', label: '播放', icon: 'material-symbols:headphones-outline-rounded' },
  { key: 'download', label: '下载', icon: 'material-symbols:download-rounded' },
  { key: 'shortcuts',label: '快捷键', icon: 'material-symbols:keyboard-outline-rounded' },
  { key: 'about',    label: '关于', icon: 'material-symbols:info-outline-rounded' }
]

const langOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' }
]

const shortcuts = [
  { label: '播放 / 暂停', key: 'Space', action: 'playPause' },
  { label: '上一曲', key: 'Ctrl + ←', action: 'prev' },
  { label: '下一曲', key: 'Ctrl + →', action: 'next' },
  { label: '音量增大', key: 'Ctrl + ↑', action: 'volUp' },
  { label: '音量减小', key: 'Ctrl + ↓', action: 'volDown' },
  { label: '静音', key: 'Ctrl + M', action: 'mute' }
]
</script>

<style scoped>
.setting-view { background: #fff; }
.dark .setting-view { background: #191919; }

.setting-nav {
  width: 180px; flex-shrink: 0;
  padding: 24px 0;
  border-right: 1px solid #eee;
}
.dark .setting-nav { border-right-color: #2a2a2a; }
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 24px; font-size: 13px; color: #666;
  cursor: pointer; transition: all 0.15s;
}
.nav-item:hover { color: #333; background: #f5f5f5; }
.dark .nav-item:hover { color: #ddd; background: #252528; }
.nav-item.is-active { color: #fc3641; background: #fef0f0; font-weight: 500; }
.dark .nav-item.is-active { background: #2a1a1c; }
.nav-icon { font-size: 18px; }

.setting-content { flex: 1; padding: 28px 40px; overflow-y: auto; }
.panel-title { font-size: 18px; font-weight: 600; color: #333; margin: 0 0 24px 0; }
.dark .panel-title { color: #eee; }

.setting-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid #f0f0f0;
}
.dark .setting-row { border-bottom-color: #252528; }
.setting-label { width: 120px; font-size: 13px; color: #555; flex-shrink: 0; }
.dark .setting-label { color: #bbb; }
.setting-val { font-size: 12px; color: #999; }

.shortcut-tag { font-family: monospace; font-size: 12px; }

.about-info { padding: 16px 0; }
</style>
