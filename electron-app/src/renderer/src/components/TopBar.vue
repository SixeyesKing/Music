<!-- TopBar.vue -->
<template>
    <div class="flex justify-between items-center drag-region py-7 px-10">
        <div class="flex items-center gap-3 no-drag">
            <div class="top_btn_l">
                <Icon icon="mingcute:left-line" class="text-xl"></Icon>
            </div>
            <div class="_input">
                <div class="flex items-center">
                    <Icon icon="mynaui:search" class="text-xl text-on-secondary ml-2 mr-2"></Icon>
                    <input type="text" class="input_" placeholder="🎉大家都在搜 汤令山">
                </div>
            </div>
            <div class="top_btn_r cursor-pointer">
                <Icon icon="flowbite:microphone-outline" class="text-xl"></Icon>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <div class="text-on-secondary text-sm flex items-center gap-1 dark:text-dark-on-surface">
                <el-avatar :size="28">
                    <Icon class="text-xl" icon="lucide:user-round" />
                </el-avatar>
                未登录
                <!-- <Vip vip level="柒"/> -->
                <Vip />
                <Icon class="text-xl" icon="mingcute:down-line" />
            </div>
            <div :class="[msg_size > 0 ? 'mail' : '']">
                <Icon icon="ion:mail-outline" class="text-xl text-on-secondary cursor-pointer no-drag hover:text-black dark:text-dark-on-surface dark:hover:text-[#ffffff]">
                </Icon>
            </div>
            <Icon icon="lets-icons:setting-alt-line" @click="openSettingView"
                class="text-xl text-on-secondary cursor-pointer no-drag hover:text-black dark:text-dark-on-surface dark:hover:text-[#ffffff]"></Icon>
            <Icon icon="fluent:minimize-16-filled"
                class="text-xl text-on-secondary cursor-pointer no-drag hover:text-black dark:text-dark-on-surface dark:hover:text-[#ffffff]"></Icon>
            <Icon icon="fluent:maximize-20-regular"
                class="text-xl text-on-secondary cursor-pointer no-drag hover:text-black dark:text-dark-on-surface dark:hover:text-[#ffffff]"></Icon>
            <Icon icon="material-symbols:close-rounded"
                class="text-xl text-on-secondary cursor-pointer no-drag hover:text-black dark:text-dark-on-surface dark:hover:text-[#ffffff]"></Icon>
        </div>
    </div>
</template>
<script setup>
import Vip from './tips/Vip.vue'
import { useTopBar } from '../composables/useTopBar'
const { msg_size, openSettingView } = useTopBar()
</script>
<style scoped>
.top_btn_l {
    border: 1px solid #dddddd;
    border-radius: 8px;
    padding: 6px 3px;
    color: #cfcfcf;
}

.top_btn_r {
    border: 1px solid #f6e2e3;
    border-radius: 8px;
    padding: 6px;
    color: #b4b4b4;
    background-color: #f7eef7;
}

.top_btn_r:hover {
    background-color: #f6e6f3;
}

._input {
    height: 36px;
    width: 250px;
    padding: 1px;
    border-radius: 8px;
    background: linear-gradient(to right, #d9e7fa, #f6e2e3);
}

._input>div {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(to right, #ebf0fb, #f8eff7);
}

.mail {
    position: relative;
    /*相对定位*/
}

.mail::before {
    position: absolute;
    content: '';
    width: 5px;
    height: 5px;
    background-color: red;
    border-radius: 50%;
    top: 1px;
    right: -1px;
}

.input_ {
    height: 36px;
    flex: 1;
    outline: none;
    font-size: 14px;
    background: transparent;
    color: #384051;
}

/* 暗色模式样式 */
:deep(.dark) .top_btn_l {
    border-color: #333333;
    color: #666666;
}

:deep(.dark) .top_btn_r {
    border-color: #333333;
    color: #666666;
    background-color: #2a2a2a;
}

:deep(.dark) .top_btn_r:hover {
    background-color: #3a3a3a;
}

:deep(.dark) ._input {
    background: linear-gradient(to right, #2a2a2a, #2a2a2a);
}

:deep(.dark) ._input>div {
    background: #1a1a1a;
}

:deep(.dark) .input_ {
    background: transparent;
    color: #d4d4d6;
}

:deep(.dark) .hover\:text-black:hover {
    color: #ffffff;
}
</style>