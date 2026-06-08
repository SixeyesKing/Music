<template>
  <div class="flex flex-col min-h-screen bg-background dark:bg-dark-background">
    
    <!-- 顶部容器 -->
    <div :style="{
      height: `calc(100vh - ${bottomMusicPlayerHeight})`
    }" class="flex">
    
      <LeftPanel></LeftPanel>
      <RightPanel></RightPanel>
    </div>

    <!-- 底部播放条 -->
    <div :style="{
      height: `${bottomMusicPlayerHeight}`,
    }" class="bg-surface dark:bg-dark-surface">底部播放条
    </div>

  </div>
</template>

<style>
  
</style>

<script setup>
import { ref } from 'vue';// 引入ref: 用于创建响应式数据

import LeftPanel from './components/LeftPanel.vue';
import RightPanel from './components/RightPanel.vue';

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const bottomMusicPlayerHeight = ref('6rem')
</script>
