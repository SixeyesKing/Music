//useSettingView.js
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { saveLanguage, getLanguage } from '../utils/language';

export function useSettingView() {
    // `t` 用于获取翻译,`locale` 用于设置当前语言
    const { locale } = useI18n() 
    //默认激活的选项卡(默认设置为“账号”)
    const selectedTab = ref('account')
    //下拉框所选择的语言（默认语言）
    const selectedLanguage = ref(getLanguage())

    //切换语言的函数
    const switchLanguage = () => {
        locale.value = selectedLanguage.value //更新 i18n 的语言
        saveLanguage(selectedLanguage.value) //将选中的语言存储到本地缓存
    }
    
    return {
        selectedTab,
        selectedLanguage,
        switchLanguage
    }
}