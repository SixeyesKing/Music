import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSheetDetail, getSheetSongs, clickSheet, collectSheet } from '../api/apiSheet'

const PAGE_SIZE = 30

export function useSheetDetail() {
  const route = useRoute()

  const sheet = ref(null)
  const songs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const collectLoading = ref(false)

  const sheetId = ref(null)
  const page = ref(1)
  const hasMore = ref(true)
  const loadingMore = ref(false)

  const loadDetail = async (id) => {
    loading.value = true
    error.value = null
    try {
      sheet.value = await getSheetDetail(id)
    } catch (e) {
      error.value = '歌单信息加载失败'
      sheet.value = null
    } finally {
      loading.value = false
    }
  }

  const loadSongs = async (id) => {
    page.value = 1
    hasMore.value = true
    try {
      const res = await getSheetSongs(id, 1, PAGE_SIZE)
      songs.value = res || []
      if (!res || res.length < PAGE_SIZE) {
        hasMore.value = false
      }
    } catch (e) {
      songs.value = []
    }
  }

  const loadMoreSongs = async () => {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const nextPage = page.value + 1
      const res = await getSheetSongs(sheetId.value, nextPage, PAGE_SIZE)
      if (res && res.length > 0) {
        songs.value = [...songs.value, ...res]
        page.value = nextPage
        if (res.length < PAGE_SIZE) {
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

  const handleClick = async () => {
    if (!sheetId.value) return
    try {
      const updated = await clickSheet(sheetId.value)
      if (updated && sheet.value) {
        sheet.value.clicksCount = updated.clicksCount
      }
    } catch (e) {
      // ignore
    }
  }

  const handleCollect = async () => {
    if (!sheetId.value || collectLoading.value) return
    collectLoading.value = true
    try {
      const updated = await collectSheet(sheetId.value)
      if (updated && sheet.value) {
        sheet.value.collectsCount = updated.collectsCount
      }
    } catch (e) {
      // ignore
    } finally {
      collectLoading.value = false
    }
  }

  const init = (id) => {
    sheetId.value = id
    loadDetail(id)
    loadSongs(id)
    handleClick()
  }

  watch(
    () => route.params.id,
    (newId) => {
      if (newId) init(newId)
    }
  )

  onMounted(() => {
    const id = route.params.id
    if (id) init(id)
  })

  return {
    sheet,
    songs,
    loading,
    error,
    collectLoading,
    sheetId,
    hasMore,
    loadingMore,
    loadDetail,
    loadSongs,
    loadMoreSongs,
    handleClick,
    handleCollect
  }
}
