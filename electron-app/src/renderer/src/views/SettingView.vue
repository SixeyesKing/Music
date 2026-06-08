<template>
    <div>
        
        <h2 class="text-3xl font-bold mb-4">{{ t('setting.title') }}</h2>
        <el-tabs v-model="selectedTab" > 
            <el-tab-pane :label="t('setting.account.title')" name="account">{{ t('setting.account.content') }}</el-tab-pane>
            <el-tab-pane :label="t('setting.routine.title')" name="routine">

            </el-tab-pane>

            <el-tab-pane :label="t('setting.system.title')" name="system">
                <div class="flex flex-col gap-5">
                    <!-- 语言设置 -->
                    <div class="flex items-center gap-3">
                        <div class="w-[5em] text-left text-on-surface dark:text-dark-on-surface">{{ t('setting.system.language') }}</div>
                        <el-select v-model="selectedLanguage" :placeholder="t('setting.system.language')" size="large" style="width: 240px;"
                            @change="switchLanguage">
                            <el-option key="zh-CN" :label="t('setting.system.chinese')" value="zh-CN" />
                            <el-option key="zh-TW" :label="t('setting.system.chineseTraditional')" value="zh-TW" />
                            <el-option key="en-US" :label="t('setting.system.english')" value="en-US" />
                            <el-option key="ja-JP" :label="t('setting.system.japanese')" value="ja-JP" />
                        </el-select>
                    </div>
                    <!-- 主题模式 -->
                    <div class="flex items-center gap-3 space-x-4">
                        <div class="w-[5em] text-left text-on-surface dark:text-dark-on-surface">{{ t('setting.routine.themeMode') }}</div>
                        <el-radio-group v-model="mode" @change="setMode">
                            <el-radio label="system">{{ t('setting.routine.followSystem') }}</el-radio>
                            <el-radio label="light">{{ t('setting.routine.light') }}</el-radio>
                            <el-radio label="dark">{{ t('setting.routine.dark') }}</el-radio>
                        </el-radio-group>
                    </div>
                </div>


                    

            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script setup>
import { useSettingView } from '../composables/useSettingView'
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { selectedTab, selectedLanguage, switchLanguage } = useSettingView()      
const { mode, isDark, setMode } = useTheme()
</script>