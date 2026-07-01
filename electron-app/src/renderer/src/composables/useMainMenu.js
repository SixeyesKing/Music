import { ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

export function useMainMenu(){
    const route = useRoute();  //route对象可以获取路由相关的信息，比如：当前路由地址，路由参数
    const router = useRouter();  //router对象可以进行路由跳转等操作

    const mainMenus = ref([
        {
            name: 'main.recommend',//'main.selected'
            icon: 'majesticons:home',
            route: '/'
        },
        {
            name: 'main.picks',//'main.blog'
            icon: 'mingcute:music-3-fill',
            route: '/picks'
        },
        {
            name: 'main.chat',
            icon: 'lets-icons:chat-alt-fill',
            route: '/chat'
        },
        {
            name: 'main.shortVideo',
            icon: 'tabler:video-filled',
            route: '/shortVideo'
        },
        {
            name: 'main.setting',
            icon: 'weui:setting-filled',
            route: '/setting'
        }

    ])

    const otherMenus = ref([
        {
            name: 'main.favoriteMusic',
            icon: 'mdi:cards-heart',
            route: '/favoriteMusic'
        },
        {
            name: 'main.RecentlyPlayed',
            icon: 'mdi:music-box',
            route: '/recentPlay'
        },
        {
            name: 'main.download',
            icon: 'mdi:download',
            route: '/download'
        },
        {
            name: 'main.myCollection',
            icon: 'mdi:star',
            route: '/myCollection'
        },
        {
            name: 'main.localMusic',
            icon: 'mdi:playlist-music',
            route: '/localMusic'
        },
    ])

    //存贮当前点击的菜单route路径
    // const currentPath = ref('')

    //判断当前点击的菜单是否被选中
    const isMenuActive = (path) =>{
        return route.path === path;
    }

    //菜单点击事件
    const handleMenuClick = (item) =>{
        router.push(item.route);
    }


    
    return {
        mainMenus,
        otherMenus,
        isMenuActive,
        handleMenuClick
    }
}