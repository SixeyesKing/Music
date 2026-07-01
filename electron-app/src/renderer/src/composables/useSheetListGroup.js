import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSheetList } from '../api/apiSheet'

const PAGE_SIZE = 20

export function useSheetListGroup() {
    const route = useRoute()
    const router = useRouter()
    const sheetList = ref([])
    const collectSheets = ref([])
    const page = ref(1)
    const hasMore = ref(true)
    const loadingMore = ref(false)

    const loadData = async () => {
        page.value = 1
        hasMore.value = true
        const res = await getSheetList(1, PAGE_SIZE)
        sheetList.value = res.list || []
        if (!res.list || res.list.length < PAGE_SIZE) {
            hasMore.value = false
        }
    }

    const loadMore = async () => {
        if (!hasMore.value || loadingMore.value) return
        loadingMore.value = true
        try {
            const nextPage = page.value + 1
            const res = await getSheetList(nextPage, PAGE_SIZE)
            if (res.list && res.list.length > 0) {
                sheetList.value = [...sheetList.value, ...res.list]
                page.value = nextPage
                if (res.list.length < PAGE_SIZE) {
                    hasMore.value = false
                }
            } else {
                hasMore.value = false
            }
        } catch (e) {
            // ignore
        } finally {
            loadingMore.value = false
        }
    }

    onMounted(() => {
        loadData()
    })

    const selected = (id) => {
        return route.name === 'sheetDetail' && route.params.id === id
    }

    const itemClick = (item) => {
        router.push({
            name: 'sheetDetail',
            params: { id: item.id }
        })
    }

    return {
        sheetList,
        collectSheets,
        hasMore,
        loadingMore,
        loadMore,
        selected,
        itemClick,
        loadData
    }
}
