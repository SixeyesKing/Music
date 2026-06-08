// setupTheme.js 主进程设置主题的方法

import { ipcMain, nativeTheme } from "electron";


export default function setupTheme(){
    ipcMain.handle('dark-mode:set', (event, mode) => { 
        //判断 mode 参数的值是否合法
        if(['system', 'light', 'dark'].includes(mode)){
            nativeTheme.themeSource = mode
        }
        return nativeTheme.shouldUseDarkColors
    })
}