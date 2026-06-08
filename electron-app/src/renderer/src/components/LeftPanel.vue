<template>
    <div class="w-[220px] h-full flex flex-col bg-slide-background dark:bg-dark-slide-background">
        <HomeLogo></HomeLogo>
        <!-- 左侧菜单 -->
        <!-- 将原来的div换成Element Plus 中的 滚动区域组件 -->
        <el-scrollbar class="flex-1">
            <div class="px-4 pb-4">
                <MainMenu ></MainMenu>
                <!-- 歌单列表 -->
                <SheetListGroup title="歌单列表" :datum="sheetList" :show-add="true" @item-click="handleSheetClick" />
                <!-- <SheetListGroup title="收藏歌单" :datum="collectSheets" @item-click="handleSheetClick" /> -->
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import HomeLogo from './HomeLogo.vue';
import MainMenu from './MainMenu.vue';
import SheetListGroup from './SheetListGroup.vue';      
import { useSheetListGroup } from '../composables/useSheetListGroup';

const router = useRouter();
const { sheetList, collectSheets } = useSheetListGroup();

const handleSheetClick = (item) => {
    router.push(`/sheetDetail/${item.id}`);
}

</script>

<style scoped>

</style>