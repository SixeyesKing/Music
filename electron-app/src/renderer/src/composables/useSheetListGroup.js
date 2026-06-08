// useSheetListGroup.js
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSheetList } from '../api/apiSheet'
export function useSheetListGroup() {
    const route = useRoute()
    const router = useRouter()
    const sheetList = ref([])
    const collectSheets = ref([])

    //暂时用模拟数据
    // sheetList.value = [
    //     {
    //         id: "1",
    //         created: "2200-04-09T16:28:49.000Z",
    //         updated: "2026-03-07T11:23:35.000Z",
    //         title: "署前街少年",
    //         icon: "assets/list1.jpg",
    //         detail: "初夏的午后，我蜷缩在阳台藤椅里看光斑在玻璃杯上跳舞。冰镇杨梅汁在杯壁凝成细密的水珠，折射出窗外栾树新抽的嫩枝，蝉鸣声和楼下孩童追逐的嬉闹在纱帘间流转。藤椅扶手的裂纹里嵌着去年深秋的银杏叶，此刻被阳光蒸腾出草木陈旧的芬芳。",
    //         clicksCount: 24459,
    //         collectsCount: 28,
    //         commentsCount: 44,
    //         songsCount: 0,
    //         userId: "1"
    //     },
    //     {
    //         id: "2",
    //         created: "2200-04-09T16:26:49.000Z",
    //         updated: "2026-03-07T04:36:13.000Z",
    //         title: "无法长大",
    //         icon: "assets/list2.jpg",
    //         detail: "行了，又到emo的时间了",
    //         clicksCount: 2557,
    //         collectsCount: 9,
    //         commentsCount: 0,
    //         songsCount: 0,
    //         userId: "1"
    //     },
    //     {
    //         id: "9",
    //         created: "2200-04-09T16:22:49.000Z",
    //         updated: "2026-03-07T15:17:09.000Z",
    //         title: "赵小雷",
    //         icon: "assets/yuanfengredehuo_andongyang.jpg",
    //         detail: "今天盘点了网络离别歌曲，用这些歌纪念那些最后还是离开的人吧。在人生的旅途中走得越远，陪你走到最后的人就越少，有些人渐行渐远，渐渐消失在人海，我们也会离开别人",
    //         clicksCount: 1034,
    //         collectsCount: 9,
    //         commentsCount: 0,
    //         songsCount: 0,
    //         userId: "1"
    //     }
    // ]

    const loadData = async () => {
        const res = await getSheetList()
        sheetList.value = res.list
    }

    onMounted(() => {
        loadData()
    })


    const selected=(id)=>{
        return route.name === 'sheetDetail' && route.params.id === id
    }

    const itemClick=(item)=>{
        router.push({
            name:'sheetDetail',
            params:{
                id:item.id
            }

        })
    }
    return {
        sheetList,
        collectSheets,
        selected,
        itemClick,
        loadData
    }
}