import { createRouter, createWebHistory } from 'vue-router'

import RecommandView from '../views/RecommandView.vue'

const routes = [
    { 
        path: '/', 
        name:'recommand', 
        component: () => import('../views/RecommandView.vue') 
    },
    { 
        path: '/picks',
        name:'picks',
        component: () => import('../views/PicksView.vue')
    },
    { 
        path: '/chat', 
        name:'chat', 
        component: () => import('../views/ChatView.vue') 
    },
    { 
        path: '/shortVideo', 
        name:'shortVideo', 
        component: () => import('../views/ShortVideo.vue') 
    },
    { 
        path: '/setting', 
        name:'setting', 
        component: () => import('../views/SettingView.vue') 
    },
    { 
        path: '/favoriteMusic', 
        name:'favoriteMusic', 
        component: () => import('../views/FavoriteMusicView.vue') 
    },
    { 
        path: '/recentPlay', 
        name:'recentPlay', 
        component: () => import('../views/RecentPlayView.vue') 
    },
    { 
        path: '/download', 
        name:'download', 
        component: () => import('../views/DownloadView.vue') 
    },
    { 
        path: '/myCollection', 
        name:'myCollection', 
        component: () => import('../views/MyCollectionView.vue') 
    },
    { 
        path: '/myMusic', 
        name:'myMusic', 
        component: () => import('../views/MyMusicView.vue') 
    },
    { 
        path: '/localMusic', 
        name:'localMusic', 
        component: () => import('../views/LocalMusicView.vue') 
    },
    { 
        path: '/myPodcast', 
        name:'myPodcast', 
        component: () => import('../views/MyPodcastView.vue') 
    },
    { 
        path: '/sheetDetail/:id', 
        name:'sheetDetail', 
        component: () => import('../views/SheetDetailView.vue') 
    }
]


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router