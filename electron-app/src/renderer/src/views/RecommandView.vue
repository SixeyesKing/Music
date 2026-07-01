<template>
  <div class="recommand-view h-full overflow-y-auto px-10 pt-6 pb-10">
    <!-- 顶部轮播卡片区 -->
    <div
      class="carousel-section"
      @mouseenter="showArrows = true"
      @mouseleave="showArrows = false"
    >
      <div ref="scrollWrap" class="carousel-scroll">
        <div
          v-for="card in carouselCards"
          :key="card.id"
          class="carousel-card"
          :style="{ backgroundImage: `url(${card.bg_url})` }"
          @click="goCarouselTarget(card)"
        >
          <span class="cc-badge">{{ card.badge }}</span>
          <div class="cc-top">
            <h3 class="cc-title">{{ card.title }}</h3>
          </div>
          <div class="cc-bottom">
            <p class="cc-line1">{{ card.line1 }}</p>
            <p class="cc-line2">{{ card.line2 }}</p>
          </div>
          <div class="cc-play">
            <Icon icon="material-symbols:play-arrow-rounded" />
          </div>
        </div>
      </div>
      <div v-show="showArrows" class="arrow arrow-left" @click="scrollCards(-1)">
        <Icon icon="material-symbols:chevron-left-rounded" />
      </div>
      <div v-show="showArrows" class="arrow arrow-right" @click="scrollCards(1)">
        <Icon icon="material-symbols:chevron-right-rounded" />
      </div>
    </div>

    <!-- 推荐歌单 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">推荐歌单</h2>
        <span class="section-more">&gt;</span>
      </div>
      <div class="sheet-grid">
        <div
          v-for="item in hotSheets"
          :key="item.id"
          class="sheet-card"
          @click="goSheet(item.id)"
        >
          <div class="sheet-cover">
            <el-image :src="res.r(item.icon)" fit="cover" class="sheet-img" lazy>
              <template #error>
                <div class="sheet-fb"><Icon icon="material-symbols:music-note-rounded" /></div>
              </template>
            </el-image>
            <div class="sheet-badge">
              <Icon icon="material-symbols:play-arrow-rounded" class="text-xs" />
              <span>{{ formatNumber(item.clicksCount) }}</span>
            </div>
            <div class="sheet-play-overlay">
              <Icon icon="material-symbols:play-arrow-rounded" />
            </div>
          </div>
          <p class="sheet-name">{{ item.title }}</p>
          <p class="sheet-desc">{{ item.detail?.substring(0, 24) || '精选歌单' }}</p>
        </div>
      </div>
    </section>

    <!-- 精选活动 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">精选活动</h2>
        <span class="section-more">&gt;</span>
      </div>
      <div class="event-row">
        <div
          v-for="ev in events"
          :key="ev.id"
          class="event-card"
          :style="{ backgroundImage: `url(${ev.bg_url})` }"
        >
          <div class="event-mask">
            <span class="event-title">{{ ev.title }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 榜单精选 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">榜单精选</h2>
        <Icon icon="material-symbols:refresh-rounded" class="text-lg text-[#999] cursor-pointer" />
      </div>
      <div class="chart-grid">
        <div
          v-for="chart in charts"
          :key="chart.id"
          class="chart-card"
        >
          <div class="chart-top">
            <span class="chart-name">{{ chart.name }}</span>
            <span class="chart-update">{{ chart.update_info }}</span>
          </div>
          <div class="chart-body">
            <div class="chart-covers">
              <div class="chart-cover c3"><el-image :src="chart.cover3 || defaultCover" fit="cover" class="cc-img" lazy /></div>
              <div class="chart-cover c2"><el-image :src="chart.cover2 || defaultCover" fit="cover" class="cc-img" lazy /></div>
              <div class="chart-cover c1">
                <el-image :src="chart.cover1 || defaultCover" fit="cover" class="cc-img" lazy />
                <div class="chart-play">
                  <div class="chart-play-btn"><Icon icon="material-symbols:play-arrow-rounded" /></div>
                </div>
              </div>
            </div>
            <div class="chart-songs">
              <div v-for="s in chart.songs" :key="s.id" class="chart-song-row">
                <span class="cs-rank">{{ s.rank_order }}</span>
                <span class="cs-title">{{ s.song_name }} - {{ s.artist }}</span>
                <span class="cs-status" :class="'st-'+s.status">{{ statusLabel(s.status) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSheetList } from '../api/apiSheet'
import { getRecommendData } from '../api/apiRecommend'
import { getCharts } from '../api/apiChart'
import res from '../utils/resource_utils'
import { formatNumber } from '../utils/format'

const router = useRouter()
const scrollWrap = ref(null)
const showArrows = ref(false)
const hotSheets = ref([])
const carouselCards = ref([])
const events = ref([])
const charts = ref([])
const defaultCover = '/src/assets/list3.png'

onMounted(async () => {
  try {
    const [sheetRes, recRes, chartRes] = await Promise.all([
      getSheetList(1, 18),
      getRecommendData(),
      getCharts()
    ])
    hotSheets.value = sheetRes.list || []
    if (recRes) {
      carouselCards.value = recRes.banners || []
      events.value = recRes.events || []
    }
    charts.value = chartRes || []
  } catch { /* ignore */ }
})

function statusLabel(s) {
  if (s === '新') return '新'
  return s
}

function scrollCards(dir) {
  if (!scrollWrap.value) return
  scrollWrap.value.scrollBy({ left: dir * 260, behavior: 'smooth' })
}

function goSheet(id) { router.push(`/sheetDetail/${id}`) }
function goCarouselTarget(card) { /* LATER: 根据 link_type/link_id 跳转 */ }
</script>

<style scoped>
.recommand-view { background: #fff; }
.dark .recommand-view { background: #191919; }

/* ===== 轮播卡片区 ===== */
.carousel-section {
  position: relative;
  margin: 24px 0;
}
.carousel-scroll {
  display: flex; gap: 20px;
  overflow-x: auto; scroll-behavior: smooth;
  padding-bottom: 8px;
  scrollbar-width: none;
}
.carousel-scroll::-webkit-scrollbar { display: none; }

.carousel-card {
  width: 220px; height: 300px; min-width: 220px;
  border-radius: 8px;
  background-size: cover; background-position: center;
  position: relative; cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}
.carousel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.cc-badge {
  position: absolute; top: 10px; left: 10px;
  padding: 2px 8px; font-size: 12px; color: #fff;
  background: rgba(0,0,0,0.4); border-radius: 4px;
  z-index: 2;
}
.cc-top {
  position: absolute; top: 0; left: 0; right: 0;
  padding: 40px 14px 0 14px; z-index: 1;
}
.cc-title {
  font-size: 20px; font-weight: 700; color: #fff;
  margin: 0; text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  line-height: 1.3;
}
.cc-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 80px; padding: 14px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  z-index: 1;
}
.cc-line1, .cc-line2 {
  font-size: 12px; color: rgba(255,255,255,0.85); margin: 0;
  line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cc-play {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 3; opacity: 0; transition: opacity 0.3s;
}
.carousel-card:hover .cc-play { opacity: 1; }
.cc-play :deep(svg) {
  width: 48px; height: 48px; color: #fff;
  background: rgba(255,255,255,0.2); border-radius: 50%;
  padding: 10px; backdrop-filter: blur(4px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

/* 左右箭头 */
.arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10; color: #fff; font-size: 22px;
  transition: background 0.3s;
}
.arrow:hover { background: rgba(0,0,0,0.5); }
.arrow-left { left: -8px; }
.arrow-right { right: -8px; }

/* ===== 章节标题 ===== */
.section { margin-bottom: 36px; }
.section-header {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 16px;
}
.section-title { font-size: 18px; font-weight: 700; color: #333; margin: 0; }
.dark .section-title { color: #eee; }
.section-more { font-size: 14px; color: #999; cursor: pointer; }

/* ===== 推荐歌单6列网格 ===== */
.sheet-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.sheet-card { cursor: pointer; }
.sheet-cover {
  position: relative; width: 100%; aspect-ratio: 1;
  border-radius: 4px; overflow: hidden; margin-bottom: 8px;
}
.sheet-img { width: 100%; height: 100%; display: block; }
.sheet-fb {
  width: 100%; height: 100%; background: #e8e8e8;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 28px;
}
.dark .sheet-fb { background: #2a2a2a; }
.sheet-badge {
  position: absolute; top: 6px; left: 6px;
  display: flex; align-items: center; gap: 2px;
  padding: 2px 7px; font-size: 11px; color: #fff;
  background: rgba(0,0,0,0.4); border-radius: 4px;
}
.sheet-play-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s;
}
.sheet-cover:hover .sheet-img { opacity: 0.8; }
.sheet-card:hover .sheet-play-overlay { opacity: 1; }
.sheet-play-overlay :deep(svg) {
  width: 40px; height: 40px; color: #fff;
  background: rgba(255,255,255,0.2); border-radius: 50%;
  padding: 8px;
}
.sheet-name {
  font-size: 14px; color: #333; margin: 0 0 4px 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dark .sheet-name { color: #ddd; }
.sheet-desc {
  font-size: 12px; color: #666; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dark .sheet-desc { color: #888; }

/* ===== 精选活动 ===== */
.event-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.event-card {
  height: 150px; border-radius: 8px;
  background-size: cover; background-position: center;
  position: relative; cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}
.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.event-mask {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 56px;
  background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
  display: flex; align-items: flex-end;
  padding: 14px 16px;
}
.event-title { font-size: 14px; color: #fff; font-weight: 500; }

/* ===== 榜单精选 ===== */
.chart-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
}
.chart-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 20px; cursor: pointer; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.dark .chart-card { background: #1e1e1e; }
.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
.chart-top {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 16px;
}
.chart-name { font-size: 16px; font-weight: 700; color: #333; }
.dark .chart-name { color: #eee; }
.chart-update { font-size: 12px; color: #999; }
.chart-body { display: flex; gap: 12px; }

/* 堆叠封面 */
.chart-covers { position: relative; width: 104px; height: 100px; flex-shrink: 0; }
.chart-cover { position: absolute; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; }
.chart-cover.c1 { top: 0; left: 0; z-index: 3; }
.chart-cover.c2 { top: 4px; left: 8px; z-index: 2; opacity: 0.8; }
.chart-cover.c3 { top: 8px; left: 16px; z-index: 1; opacity: 0.6; }
.cc-img { width: 100%; height: 100%; display: block; }
.chart-play {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  z-index: 5; opacity: 0; transition: opacity 0.2s;
  background: rgba(0,0,0,0.25); border-radius: 8px;
}
.chart-card:hover .chart-play { opacity: 1; }
.chart-play-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.92);
  display: flex; align-items: center; justify-content: center;
  color: #fc3641; font-size: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* 歌曲列表 */
.chart-songs { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.chart-song-row { display: flex; align-items: center; gap: 6px; height: 34px; }
.cs-rank { font-size: 14px; font-weight: 700; color: #333; min-width: 14px; text-align: left; flex-shrink: 0; }
.dark .cs-rank { color: #ddd; }
.cs-title {
  flex: 1; font-size: 13px; color: #333;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dark .cs-title { color: #ddd; }
.cs-status { font-size: 12px; font-weight: 600; flex-shrink: 0; }
.st-新 { color: #4caf50; }
.st-▲ { color: #fc3641; }
.st-▼ { color: #4caf50; }
.st-— { color: #999; }
</style>
