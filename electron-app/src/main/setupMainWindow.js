// 创建主窗口
import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'

export default function setupMainWindow(){
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1060,
    height: 750,
    minWidth:1060,
    minHeight:760,
    show: false,
    titleBarStyle: 'hidden',//隐藏默认标题栏
    //如果当前系统为windows或者linux，则使用无边框窗口；如果为macOS，则启用红绿灯按钮的标题栏覆盖
    ...(process.platform === 'darwin'
      ? {
        titleBarOverlay:true
      }
      :{
        frame:false
      }
    ),
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow;
}