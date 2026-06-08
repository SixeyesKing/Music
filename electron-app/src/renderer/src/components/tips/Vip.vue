<!-- Vip.vue -->
<template>
    <div class="box">
        <div :class="[vip?'vip _l':'_l']">
            <div></div>
        </div>
        <div :class="[vip?'vip _r':'_r']">
            VIP <span>{{ vip?'-':' ' }} {{ level }}</span>
        </div>
    </div>
</template>
<script setup>
defineProps({
    vip:{
        type:Boolean,
        default:false
    },
    level:{
        type:String,
        default:'开通'
    }
})
</script>
<style scoped>
.box{
    display:  flex;
    align-items: center;
    margin-right: -8px;
}
._l{
    width: 1.4em;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: #dadada;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #f7f9fc;
    position: relative;
    z-index: 99;
}
._l>div{
    width: 0.4em;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: #dddddd;
    border: 1px solid #d5d5d5;
}

.vip{
    background-color: #333 !important;
    color: #d5b9b4 !important;
}
.vip>div{
    background-color: red;
}
._r{
    font-size: 0.5em;
    height: 1.6em;
    background-color: #cccccc;
    color: white;
    display: flex;
    align-items: center;
    padding-left: 8px;
    padding-right: 5px;
    position: relative;
    left: -5px;
    border-radius: 0 1em 1em 0;
}

</style>