<template>
    <div class="left-panel">
        <HomeLogo></HomeLogo>
        <el-scrollbar
            class="left-scrollbar"
            v-infinite-scroll="onLoadMore"
            :infinite-scroll-disabled="!hasMore || loadingMore"
            infinite-scroll-distance="80"
        >
            <div class="left-inner">
                <MainMenu></MainMenu>
                <SheetListGroup
                    title="我的歌单"
                    :datum="sheetList"
                    :show-add="true"
                    :loading-more="loadingMore"
                    :has-more="hasMore"
                    @item-click="handleSheetClick"
                />
            </div>
        </el-scrollbar>
        <div class="left-footer">
            <span class="footer-text">{{ sheetList.length }} 个歌单</span>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import HomeLogo from './HomeLogo.vue';
import MainMenu from './MainMenu.vue';
import SheetListGroup from './SheetListGroup.vue';
import { useSheetListGroup } from '../composables/useSheetListGroup';

const router = useRouter();
const { sheetList, hasMore, loadingMore, loadMore } = useSheetListGroup();

const handleSheetClick = (item) => {
    router.push(`/sheetDetail/${item.id}`);
}

function onLoadMore() {
    loadMore()
}
</script>

<style scoped>
.left-panel {
    width: 220px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #F0F3F6;
    border-right: 1px solid #e8e8e8;
}
.dark .left-panel {
    background: #1a1a21;
    border-right-color: #1b1b20;
}

.left-scrollbar {
    flex: 1;
}

.left-inner {
    padding: 0 16px 16px 16px;
}

.left-footer {
    padding: 10px 16px;
    border-top: 1px solid #e8e8e8;
}
.dark .left-footer {
    border-top-color: #1b1b20;
}
.footer-text {
    font-size: 11px;
    color: #bbb;
}
.dark .footer-text {
    color: #555;
}
</style>
