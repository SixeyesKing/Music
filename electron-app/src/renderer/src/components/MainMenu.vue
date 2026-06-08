<template>
    <div>
        <!-- 主菜单 -->
        <!-- <Icon icon="mdi:home"></Icon> -->
        <ItemMainMenu
        v-for="item in mainMenus"
        :key="item.route"
        :data="item"
        :is-active="isMenuActive(item.route)"
        @click="handleMenuClick(item)"
        ></ItemMainMenu>

        <el-divider style="margin:10px 0" />

        <!-- 其他菜单 -->
        <ItemMainMenu v-for="item in otherMenus" 
        :key="item.route" 
        :data="item" 
        :is-active="isMenuActive(item.route)"
        @click="handleMenuClick(item)"
        ></ItemMainMenu>
    </div>
</template>

<script setup>
import { useMainMenu } from '../composables/useMainMenu';
import ItemMainMenu from './ItemMainMenu.vue';

const { mainMenus, otherMenus, isMenuActive, handleMenuClick } = useMainMenu();



</script>

<style scoped>

</style>