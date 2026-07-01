<template>
    <div
        class="sheet-item"
        :class="{ 'is-selected': selected }"
        @click="$emit('click', data)"
    >
        <div class="sheet-cover">
            <el-image
                class="cover-img"
                :src="res.r(data.icon)"
                fit="cover"
            >
                <template #error>
                    <div class="cover-fallback">
                        <el-icon><Headset /></el-icon>
                    </div>
                </template>
            </el-image>
            <div class="cover-play-overlay">
                <el-icon><VideoPlay /></el-icon>
            </div>
        </div>
        <span class="sheet-title">{{ data.title }}</span>
    </div>
</template>

<script setup>
import res from '../utils/resource_utils'

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

defineEmits(['click'])
</script>

<style scoped>
.sheet-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
}
.sheet-item:hover {
    background: #e8eaed;
}
.dark .sheet-item:hover {
    background: #28282d;
}
.sheet-item.is-selected {
    background: #fef0f0;
}
.dark .sheet-item.is-selected {
    background: #2a1a1c;
}
.sheet-item.is-selected .sheet-title {
    color: #fc3641;
    font-weight: 500;
}

.sheet-cover {
    position: relative;
    width: 33px;
    height: 33px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
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
    font-size: 16px;
}
.dark .cover-fallback {
    background: #2a2a2a;
    color: #555;
}
.cover-play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.2s;
}
.sheet-item:hover .cover-play-overlay {
    opacity: 1;
}

.sheet-title {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    color: #333;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.dark .sheet-title {
    color: #d4d4d6;
}
</style>
