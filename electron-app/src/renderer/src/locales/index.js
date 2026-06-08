import { createI18n } from 'vue-i18n'

//语言配置
import enUS from './en-US'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import jaJP from './ja-JP'

//语言配置整合
const messages={
    'en-US':{...enUS},
    'zh-CN':{...zhCN},
    'zh-TW':{...zhTW},
    'ja-JP':{...jaJP}
}

//创建 i18n 实例
const i18n =createI18n({
    globalInjection:true,//全局模式,可以直接使用 $t
    messages,//挂载语言包
    locale:'zh-CN',
    messages
})
//导出 i18n 实例
export default i18n