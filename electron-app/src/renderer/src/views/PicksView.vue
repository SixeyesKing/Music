<template>
  <div class="picks-view h-full overflow-y-auto overflow-x-hidden">
    <!-- 顶部导航栏 -->
    <div class="picks-nav">
      <span
        v-for="nav in navItems"
        :key="nav"
        class="nav-item"
        :class="{ 'is-active': activeNav === nav }"
        @click="activeNav = nav"
      >{{ nav }}</span>
    </div>

    <div class="picks-content px-10 pb-10">
      <!-- 官方歌单 -->
      <section class="picks-section">
        <div class="section-header">
          <h2 class="section-title">官方歌单</h2>
          <Icon icon="material-symbols:chevron-right-rounded" class="text-[#999] text-xl" />
        </div>
        <div class="playlist-row">
          <div
            v-for="pl in playlists"
            :key="pl.id"
            class="pl-card"
            @mouseenter="hoverCard = pl.id"
            @mouseleave="hoverCard = null"
          >
            <div class="pl-cover" :style="pl.cover_url ? { backgroundImage: `url(${pl.cover_url})`, '--cover': `url(${pl.cover_url})` } : {}">
              <div v-if="!pl.cover_url" class="pl-cover-fb">
                <Icon icon="material-symbols:music-note-rounded" />
              </div>
              <div class="pl-badge">
                <Icon icon="material-symbols:headphones-rounded" class="text-xs" />
                <span>{{ pl.play_count }}</span>
              </div>
              <div class="pl-bottom-mask" :class="{ 'is-hidden': hoverCard === pl.id }">
                <p class="pl-main-title">{{ pl.title }}</p>
                <p class="pl-sub-title">{{ pl.subtitle }}</p>
              </div>
              <Transition name="slide-up">
                <div v-if="hoverCard === pl.id" class="pl-popup">
                  <p class="pop-title">{{ pl.subtitle || pl.title }}</p>
                  <div class="pop-songs">
                    <p v-for="s in pl.songs" :key="s.id" class="pop-song">
                      <span class="pop-song-idx">{{ s.rank_order }}</span>
                      {{ s.song_name }}
                    </p>
                  </div>
                  <div class="pop-play-btn">
                    <Icon icon="material-symbols:play-arrow-rounded" />
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <!-- 最新音乐 -->
      <section class="picks-section">
        <div class="section-header">
          <h2 class="section-title">最新音乐</h2>
          <Icon icon="material-symbols:chevron-right-rounded" class="text-[#999] text-xl" />
        </div>
        <div class="latest-grid">
          <div class="latest-col" v-for="col in [0,1]" :key="col">
            <div
              v-for="item in latestByCol(col)"
              :key="item.id"
              class="latest-row"
            >
              <div class="lr-cover">
                <el-image v-if="item.cover_url" :src="item.cover_url" fit="cover" class="lr-img" lazy />
                <div v-else class="lr-cover-fb"><Icon icon="material-symbols:music-note-rounded" /></div>
              </div>
              <div class="lr-info">
                <span class="lr-title">{{ item.song_name }}</span>
                <span class="lr-meta">
                  <span v-if="item.tags" class="lr-tag" :class="t === '超清母带' ? 'tag-master' : 'tag-red'" v-for="t in item.tags.split('、')" :key="t">{{ t }}</span>
                  <span class="lr-artist">{{ item.artist }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPicksData } from '../api/apiPicks'

const activeNav = ref('精选')
const hoverCard = ref(null)
const playlists = ref([])
const latest = ref([])

const navItems = ['精选','歌单广场','排行榜','歌手','VIP','摇滚','华语','情歌','出行','经典','更多∨']

onMounted(async () => {
  try {
    const data = await getPicksData()
    if (data) {
      playlists.value = data.playlists || []
      latest.value = data.latest || []
    }
  } catch { /* ignore */ }
})

function latestByCol(col) {
  return latest.value.filter(l => l.col_pos === col)
}
</script>

<style scoped>
.picks-view { background: #fff; }
.picks-view::-webkit-scrollbar { width: 0; }
.dark .picks-view { background: #191919; }

/* 顶部导航 */
.picks-nav {
  display: flex; align-items: center; gap: 0;
  padding: 0 40px; height: 48px;
  border-bottom: 1px solid #eee;
  position: sticky; top: 0; z-index: 10;
  background: #fff; overflow-x: auto; overflow-y: hidden;
  scrollbar-width: none;
}
.picks-nav::-webkit-scrollbar { display: none; }
.dark .picks-nav { background: #191919; border-bottom-color: #2a2a2a; }
.nav-item {
  padding: 0 18px; height: 100%;
  display: flex; align-items: center;
  font-size: 14px; color: #555; cursor: pointer;
  position: relative; white-space: nowrap;
  transition: color 0.15s;
}
.nav-item:hover { color: #fc3641; }
.nav-item.is-active { color: #fc3641; }
.nav-item.is-active::after {
  content: ''; position: absolute; bottom: 0; left: 18px; right: 18px;
  height: 3px; background: #fc3641; border-radius: 1.5px;
}
.dark .nav-item { color: #aaa; }
.dark .nav-item:hover { color: #fc3641; }

/* 区块 */
.picks-section { margin-top: 32px; }
.picks-content { background: #fff; }
.dark .picks-content { background: #191919; }
.section-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 16px;
}
.section-title { font-size: 18px; font-weight: 700; color: #333; margin: 0; }
.dark .section-title { color: #eee; }

/* 官方歌单卡片 */
.playlist-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.pl-card {
  position: relative; cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.pl-card:hover { transform: translateY(-4px); z-index: 20; }
.pl-cover {
  width: 100%; aspect-ratio: 3/4; border-radius: 8px; overflow: hidden;
  background-size: cover; background-position: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.pl-card:hover .pl-cover { box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.pl-cover-fb {
  width: 100%; height: 100%; background: #e0e0e0;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 48px;
}
.pl-badge {
  position: absolute; top: 10px; right: 10px; z-index: 2;
  display: flex; align-items: center; gap: 4px;
  padding: 3px 8px; font-size: 11px; color: #fff;
  background: rgba(0,0,0,0.4); border-radius: 10px;
}
.pl-bottom-mask {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 40px 14px 14px 14px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  z-index: 1; transition: opacity 0.3s;
}
.pl-bottom-mask.is-hidden { opacity: 0; }
.pl-main-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0; line-height: 1.3; }
.pl-sub-title { font-size: 11px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0; line-height: 1.4; }

/* hover 浮层 — 在卡片内，从底部向上滑出，毛玻璃效果 */
.pl-popup {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 18px 14px 16px 14px;
  border-radius: 0 0 8px 8px;
  z-index: 3; overflow: hidden;
}
.pl-popup::before {
  content: '';
  position: absolute; inset: 0;
  background-image: var(--cover);
  background-size: cover; background-position: center bottom;
  filter: blur(20px) brightness(0.5);
  transform: scale(1.2);
  z-index: -1;
}
.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(40%); }
.slide-up-leave-to { opacity: 0; transform: translateY(20%); }
.pop-title {
  font-size: 12px; font-weight: 600; color: #fff;
  margin: 0 0 10px 0; line-height: 1.5;
}
.pop-songs { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.pop-song { font-size: 12px; color: rgba(255,255,255,0.7); margin: 0; display: flex; gap: 6px; }
.pop-song-idx { color: rgba(255,255,255,0.4); min-width: 14px; }
.pop-play-btn {
  position: absolute; bottom: 14px; right: 14px;
  width: 36px; height: 36px; border-radius: 50%;
  background: #fff; display: flex; align-items: center; justify-content: center;
  color: #333; font-size: 22px;
}

/* 最新音乐 */
.latest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.latest-col { display: flex; flex-direction: column; }
.latest-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 12px; border-radius: 6px; cursor: pointer;
  transition: background 0.15s;
}
.latest-row:hover { background: #f5f5f5; }
.dark .latest-row:hover { background: #252528; }
.lr-cover { width: 48px; height: 48px; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.lr-img { width: 100%; height: 100%; }
.lr-cover-fb {
  width: 100%; height: 100%; background: #e8e8e8;
  display: flex; align-items: center; justify-content: center;
  color: #bbb; font-size: 22px;
}
.dark .lr-cover-fb { background: #2a2a2a; }
.lr-info { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.lr-title { font-size: 14px; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dark .lr-title { color: #ddd; }
.lr-meta { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; overflow: hidden; }
.lr-tag {
  font-size: 10px; padding: 1px 5px; border-radius: 3px;
  white-space: nowrap; flex-shrink: 0;
}
.tag-master { background: #fff3cd; color: #856404; }
.tag-red { background: #fef0f0; color: #fc3641; border: 1px solid rgba(252,54,65,0.2); }
.lr-artist { font-size: 12px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
