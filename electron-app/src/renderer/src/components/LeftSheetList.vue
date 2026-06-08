<template>
    <div class="flex items-center gap-2 p-2 cursor-pointer rounded-md" 
    :class="selected 
    ? 'bg-primary text-white' 
    : 'text-on-surface dark:text-dark-on-surface dark:text-dark-on-surface hover:bg-hover dark:hover:bg-dark-h'">
        <!-- 左侧封面图 -->
        <el-image class="item-menu-sheet-icon rounded-sm shrink-0" :src="res.r(data.icon)" :fit="fit" />
        <!-- 歌单标题（最多两行） -->
        <div class="flex-1 leading-snug line-clamp-2 text-xs">{{ data.title }}</div>
    </div>
</template>
<script setup>
//父组件传递过来的数据
defineProps({
    data: {
        type: Object,
        reqired: true
    },
    selected: {
        type: Boolean,
        default: false
    }
})
</script>
<style scoped>
.item-menu-sheet-icon {
    width: 33px;
    height: 33px;
    object-fit: cover;
}
</style>