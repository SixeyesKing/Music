<template>
    <div
        class="item-main-menu"
        :class="{
            'is-active': isActive
        }"
    >
        <Icon class="menu-icon" :icon="data.icon"></Icon>
        <span class="menu-text">{{ $t(data.name) }}</span>
    </div>
</template>

<script setup>
defineProps({
    data: Object,
    isActive: Boolean
})
</script>

<style scoped>
.item-main-menu {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 35px;
    margin: 4px auto;
    padding: 0 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
    color: #606266;
}
.item-main-menu:hover {
    background: #e8eaed;
    color: #333;
}
.dark .item-main-menu {
    color: #a4a4a6;
}
.dark .item-main-menu:hover {
    background: #28282d;
    color: #d4d4d6;
}
.item-main-menu.is-active {
    background: #fc3641;
    color: #fff;
}
.dark .item-main-menu.is-active {
    background: #fc3641;
    color: #fff;
}
.menu-icon {
    font-size: 20px;
    flex-shrink: 0;
}
.menu-text {
    font-size: 14px;
    white-space: nowrap;
}
</style>
