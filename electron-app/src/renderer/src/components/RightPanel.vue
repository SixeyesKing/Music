<template>
    <div class=" flex flex-col h-full bg-background dark:bg-dark-background" :style="{ width: `calc(100vw - 220px)` }">
        <!-- 头部组件 -->
         <TopBar></TopBar>
        <!-- 内容区域 -->
         <div class="content-wrapper">
            <RouterView></RouterView>
         </div>
    </div>
</template>

<script setup>
import TopBar from './TopBar.vue';
</script>

<style scoped>
.content-wrapper {
    margin-left: 40px;
}
</style>