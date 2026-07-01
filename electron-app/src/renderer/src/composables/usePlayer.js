import { ref, watch } from 'vue'
import { Howl } from 'howler'
import { getSongStreamUrl } from '../api/apiMusic'

const STORAGE_KEY = 'music_player_state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.currentSong) currentSong.value = data.currentSong
      if (data.playlist) playlist.value = data.playlist
      if (data.currentIndex != null) currentIndex.value = data.currentIndex
      if (data.volume != null) volume.value = data.volume
    }
  } catch { /* ignore */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentSong: currentSong.value,
      playlist: playlist.value,
      currentIndex: currentIndex.value,
      volume: volume.value
    }))
  } catch { /* ignore */ }
}

// 模块级单例
const currentSong = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const playlist = ref([])
const currentIndex = ref(-1)

// 最近播放 (localStorage, 最多50条)
const RECENT_KEY = 'music_recent_plays'

function saveRecentPlay(song) {
  try {
    let list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    list = list.filter(s => s.id !== song.id)
    list.unshift({
      id: song.id, title: song.title, artist: song.artist,
      album: song.album, duration: song.duration,
      cover_url: song.cover_url, url: song.url,
      playedAt: new Date().toLocaleString('zh-CN')
    })
    if (list.length > 50) list = list.slice(0, 50)
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch { /* ignore */ }
}

// 启动时恢复状态
loadState()

let howl = null
let progressTimer = null

function stopProgress() {
  if (progressTimer) {
    cancelAnimationFrame(progressTimer)
    progressTimer = null
  }
}

function startProgress() {
  stopProgress()
  function tick() {
    if (!howl) return
    currentTime.value = howl.seek() || 0
    duration.value = howl.duration() || 0
    if (howl.playing()) {
      progressTimer = requestAnimationFrame(tick)
    }
  }
  tick()
}

function destroyHowl() {
  stopProgress()
  if (howl) {
    howl.unload()
    howl = null
  }
}

export function usePlayer() {
  async function resolveUrl(song) {
    try {
      const url = await getSongStreamUrl(song.id)
      return url || song.url
    } catch {
      return song.url
    }
  }

  async function play(song, list) {
    if (!song) return

    if (list && list.length) {
      playlist.value = [...list]
    } else if (playlist.value.length === 0) {
      playlist.value = [song]
    }
    currentIndex.value = playlist.value.findIndex(s => s.id === song.id)
    if (currentIndex.value === -1) {
      currentIndex.value = 0
    }
    currentSong.value = song
    currentTime.value = 0
    duration.value = song.duration || 0
    saveRecentPlay(song)

    destroyHowl()

    const streamUrl = await resolveUrl(song)
    if (!streamUrl) return

    howl = new Howl({
      src: [streamUrl],
      html5: true,
      volume: volume.value,
      onplay: () => {
        isPlaying.value = true
        startProgress()
      },
      onpause: () => {
        isPlaying.value = false
        stopProgress()
      },
      onend: () => {
        isPlaying.value = false
        stopProgress()
        const next = (currentIndex.value + 1) % playlist.value.length
        if (playlist.value[next]) {
          play(playlist.value[next], playlist.value)
        }
      },
      onstop: () => {
        isPlaying.value = false
        stopProgress()
      },
      onload: () => {
        duration.value = howl.duration() || song.duration || 0
      },
      onloaderror: () => {
        destroyHowl()
        isPlaying.value = false
      }
    })

    howl.play()
    saveState()
  }

  function togglePlay() {
    if (!howl) {
      if (currentSong.value && currentSong.value.url) {
        play(currentSong.value, playlist.value)
      }
      return
    }
    if (howl.playing()) {
      howl.pause()
    } else {
      howl.play()
    }
  }

  function playNext() {
    if (playlist.value.length === 0) return
    const next = (currentIndex.value + 1) % playlist.value.length
    play(playlist.value[next], playlist.value)
  }

  function playPrev() {
    if (playlist.value.length === 0) return
    const prev = currentIndex.value <= 0
      ? playlist.value.length - 1
      : currentIndex.value - 1
    play(playlist.value[prev], playlist.value)
  }

  function seek(time) {
    if (!howl) return
    howl.seek(time)
    currentTime.value = time
  }

  function setVolume(v) {
    volume.value = Math.max(0, Math.min(1, v))
    if (howl) {
      howl.volume(volume.value)
    }
    saveState()
  }

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playlist,
    currentIndex,
    play,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume
  }
}
