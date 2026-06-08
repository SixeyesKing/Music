const STORAGE_KEY = 'lang'

export function saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang)
}

export function getLanguage() {
    return localStorage.getItem(STORAGE_KEY) || 'zh-CN'
}