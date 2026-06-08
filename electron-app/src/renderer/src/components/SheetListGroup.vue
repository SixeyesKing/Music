<template>
    <el-divider style="margin:10px 0" />
    <div class="flex flex-col gap-2">
        <!-- 标题 -->
        <div class="flex justify-between items-center text-outline">
            <div class="flex items-center gap-1 text-xs font-bold">
                <span>{{ title }}</span>
                <span>({{ currentData.length }})</span>
            </div>
            <el-icon v-if="showAdd" class="cursor-pointer" @click="handleAdd">  
                <CirclePlus />
            </el-icon>
        </div>
        <!-- end标题 -->

        <!-- 歌单列表 -->
        <div class="flex flex-col gap-2 mt-3">
            <SheetListItem v-for="item in currentData" :key="item.id" 
            :data="item" 
            :selected="selected(item.id)"
            @click="itemClick(item)" />
        </div>
        <!-- end歌单列表 -->
    </div>
</template>
<script setup>
import { computed } from 'vue'
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
    }
})

const emit = defineEmits(['onAdd', 'itemClick'])

const { sheetList, collectSheets, selected, itemClick , loadData } = useSheetListGroup()

const currentData = computed(() => {
    return props.datum.length > 0 ? props.datum : sheetList.value
})

const handleAdd = () => {
    emit('onAdd')
}
</script>
