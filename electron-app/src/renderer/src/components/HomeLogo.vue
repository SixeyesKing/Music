<template>
    <div class="logo-container flex flex-col items-center justify-center drag-region shrink-0">
        <img :src="isDark ? '/src/assets/images/dark-logo.png' : '/src/assets/images/logo.png'" alt="logo"
         class="logo no-drag cursor-pointer" 
         @click="logoClick" />
    </div>
</template>
<script setup>
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const logoClick = () => {
    console.log('HomeLogo logoClick')
}
</script>
<style scoped>
.logo-container {
    height: 6rem;
    /* height:h-[6.5rem]; */
}

.logo {
    height: 42px;
}
</style>