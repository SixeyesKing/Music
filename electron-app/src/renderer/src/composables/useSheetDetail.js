import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSheetDetail, getSheetSongs, clickSheet, collectSheet } from '../api/apiSheet'

export function useSheetDetail() {
  const route = useRoute()

  const sheet = ref(null)
  const songs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const collectLoading = ref(false)

  const sheetId = ref(null)

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
    try {
      const res = await getSheetSongs(id)
      songs.value = res || []
    } catch (e) {
      songs.value = []
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

  // 监听路由参数变化
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
    loadDetail,
    loadSongs,
    handleClick,
    handleCollect
  }
}
