// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('./src/Engine/LoadConfig');
const IPCEVENTS = require('./src/Engine/Events');
global.MyEngine = {};//新建一个全局节点,保存数据。
global.MyEngine.StatusMachine = {};

let mainWindow
//register some listener

ipcMain.on(IPCEVENTS.GET_NOW_PLAYING_SECTION, (event, arg) => {
  event.sender.send(IPCEVENTS.SET_NOW_PLAYING_SECTION,
    global.MyEngine.StatusMachine.NowPlayingSection)
});

function createWindow() {
  //加载窗口预设启动游戏
  let Options = {
    width: 1280, height: 720, autoHideMenuBar: true, webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: false,
      webSecurity: false,
      preload: path.join(__dirname, './public/renderer.js')
    },
    resizable: false,
    show: false
  };

  if (global.Environment !== null || global.Environment !== undefined) {
    Options.width = global.Environment.Resolution['X'];
    Options.height = global.Environment.Resolution['Y'];
  }
  global.MyEngine.StatusMachine.NowPlayingSection = require('./src/Engine/StatusMachine').NowPlayingSection;

  mainWindow = new BrowserWindow(Options)
  mainWindow.loadURL("http://localhost:3000/");
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
