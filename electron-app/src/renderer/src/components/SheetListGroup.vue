<template>
    <div class="sheet-group">
        <div class="group-header">
            <span class="group-title">{{ title }}</span>
            <span class="group-count">({{ currentData.length }})</span>
            <el-icon
                class="toggle-btn"
                :class="{ 'is-collapsed': collapsed }"
                @click="collapsed = !collapsed"
            >
                <ArrowDown />
            </el-icon>
            <el-icon v-if="showAdd" class="group-add-btn" @click="handleAdd">
                <CirclePlus />
            </el-icon>
        </div>

        <template v-if="!collapsed">
            <div class="group-list">
                <SheetListItem
                    v-for="item in currentData"
                    :key="item.id"
                    :data="item"
                    :selected="selected(item.id)"
                    @click="itemClick(item)"
                />
            </div>

            <div v-if="loadingMore" class="load-more">
                <el-icon class="animate-spin"><Loading /></el-icon>
            </div>
            <div v-else-if="!hasMore && currentData.length > 0" class="load-more no-more">
                没有更多了
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SheetListItem from './SheetListItem.vue'
import { useSheetListGroup } from '../composables/useSheetListGroup'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    datum: {
        type: Array,
        default: () => []
    },
    showAdd: {
        type: Boolean,
        default: false
    },
    loadingMore: {
        type: Boolean,
        default: false
    },
    hasMore: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['onAdd', 'itemClick'])

const { sheetList, selected, itemClick } = useSheetListGroup()
const collapsed = ref(false)

const currentData = computed(() => {
    return props.datum.length > 0 ? props.datum : sheetList.value
})

const handleAdd = () => {
    emit('onAdd')
}
</script>

<style scoped>
.sheet-group {
    margin-top: 18px;
}

.group-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    margin-bottom: 6px;
}
.toggle-btn {
    font-size: 12px;
    color: #bbb;
    cursor: pointer;
    transition: transform 0.2s;
    flex-shrink: 0;
}
.toggle-btn:hover {
    color: #666;
}
.dark .toggle-btn:hover {
    color: #aaa;
}
.toggle-btn.is-collapsed {
    transform: rotate(-90deg);
}
.group-title {
    font-size: 12px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.dark .group-title {
    color: #777;
}
.group-count {
    font-size: 11px;
    color: #bbb;
}
.dark .group-count {
    color: #666;
}
.group-add-btn {
    margin-left: auto;
    font-size: 15px;
    color: #999;
    cursor: pointer;
    transition: color 0.15s;
}
.group-add-btn:hover {
    color: #fc3641;
}

.group-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0 4px 0;
    font-size: 12px;
    color: #bbb;
}
.load-more.no-more {
    color: #ccc;
}
</style>
