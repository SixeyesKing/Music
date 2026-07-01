<template>
    <div class="right-panel">
        <TopBar></TopBar>
        <div class="right-content flex-1 overflow-hidden">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup>
import TopBar from './TopBar.vue';
</script>

<style scoped>
.right-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    flex: 1;
    min-width: 0;
}
.dark .right-panel {
    background: #191919;
}

</style>
