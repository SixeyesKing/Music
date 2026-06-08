<template>
    <div class="flex items-center gap-2 p-2 cursor-pointer rounded-md transition-colors" 
    :class="[selected ? 'bg-primary text-white' : 'text-on-secondary dark:text-dark-on-secondary hover:bg-hover dark:hover:bg-dark-hover']" @click="$emit('click', data)">
        <!-- 左侧封面图 -->
        <el-image class="w-[33px] h-[33px] item-menu-sheet-icon rounded-sm shrink-0" :src="res.r(data.icon)" :fit="fit">
            <!-- 当图片加载不出来的时候 显示插槽内的图片 -->
            <template #error>
                <div class="image-slot">
                    <img src="../assets/images/error_image.png" alt="Error">
                </div>
            </template>
        </el-image>
        <!-- 歌单标题（最多两行） -->
        <div class="flex-1 leading-snug line-clamp-2 text-xs truncate">{{ data.title }}</div>
    </div>
</template>

<script setup>
defineProps({
    data: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.sheet-item:hover {
    background-color: transparent;
}

:deep(.dark) .sheet-item:hover {
    background-color: transparent;
}
</style>