// useTheme.js
import { ref } from "vue"

// 存储在 localStorage 中 主题的key
const THEME_KEY = 'theme-model'
// 从 localStorage 中获取主题模式，如果没有则默认为 'system'（跟随系统）
const mode = ref(localStorage.getItem(THEME_KEY) || 'system')
// 是否深色模式的标记，false表示浅色模式，true表示深色模式
const isDark = ref(false)
let stopSystemDarkWatcher = null

// 应用主题
async function applyTheme(m) {
    stopSystemDarkWatcher?.()
    stopSystemDarkWatcher = null
    const targetMode = m || mode.value
    if (targetMode === 'system') {
        // 1.判断当前系统是否是深色模式
        isDark.value = getSystemDark()
        // 2.根据判断的结果动态给html增加|删除 dark样式
        updateHtmlClass(isDark.value)
        // 3.监听系统主题的变化
        stopSystemDarkWatcher = createSystemDarkWatcher((dark) => {
            isDark.value = dark
            updateHtmlClass(dark)
        })
        // 4.将设置主题同步给主进程
        await window.api?.setDarkMode?.(targetMode)
    } else {
        isDark.value = targetMode === 'dark'
        updateHtmlClass(isDark.value)
        await window.api?.setDarkMode?.(targetMode)
    }
    // 将最新的主题存贮到缓存中
    localStorage.setItem(THEME_KEY, targetMode)
    mode.value = targetMode
}
// 通过媒体查询 获取当前系统是否是深色模式
function getSystemDark() {
    return window.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false
}

// 监听系统主题的变化
function createSystemDarkWatcher(callback) {
    //如果不支持媒体查询，直接返回一个空函数
    if (!window.matchMedia) return () => { }
    // 获取媒体查询对象
    const mediaQuery = window.matchMedia('(prefers-color-scheme:dark)')
    // 定义一个监听方法
    const listener = (e) => callback(e.matches)
    // 绑定监听事件
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
}

// 动态给html增加 dark 样式的方法
const updateHtmlClass = (dark) => {
    const html = document.documentElement
    if (dark) {
        // 如果是深色模式，则给html元素添加dark样式
        html.classList.add('dark')
    } else {
        // 如果是浅色模式，则给html元素移除dark样式
        html.classList.remove('dark')
    }
}

export function useTheme() {
    // 设置主题的方法
    const setMode = (mode) => applyTheme(mode)
    // 初始化主题的方法，在应用启动时调用，确保主题设置生效
    const initTheme = () => applyTheme(mode.value)

    return {
        mode: mode,
        isDark: isDark,
        setMode,
        initTheme
    }
}