<template>
    <div class="item-main-menu flex items-center gap-3 cursor-pointer rounded-md" 
    :class="[isActive ? 'bg-primary text-white' 
    : 'text-on-secondary dark:text-dark-on-secondary hover:bg-hover dark:hover:bg-dark-hover']"
    >
        <Icon class="text-xl" :icon="data.icon"></Icon>
        <span class="text-sm">{{ $t(data.name) }}</span>
    </div>
</template>
<script setup>
// 接收父组件传递的参数
defineProps({
    data: Object,
    isActive: Boolean //当前菜单项是否是激活状态
})
</script>
<style scoped>
.item-main-menu{
    height: 35px;
    margin: 4px auto;
    padding-left: 10px;
    padding-right: 10px;
}
</style>