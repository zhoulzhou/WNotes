import * as path from 'path';
import { IPC_CHANNELS } from './ipc-channels';
import * as database from './database';
import * as file from './file';
import * as image from './image';

let mainWindow: any = null;
let tray: any = null;

function createTray(): void {
  const { Tray, Menu, nativeImage, app } = require('electron');
  const fs = require('fs');
  const path = require('path');
  
  console.log('===== 托盘图标创建信息 =====');
  console.log('appPath:', app.getAppPath());
  console.log('__dirname:', __dirname);
  console.log('process.resourcesPath:', (process as any).resourcesPath);
  
  // 尝试多个可能的图标路径
  let iconPath;
  let foundPath = null;
  
  // 定义所有可能的路径
  const possiblePaths = [
    // 打包后的路径（resources/app.asar 或 resources/app）
    (process as any).resourcesPath ? path.join((process as any).resourcesPath, 'app.asar.unpacked', 'build', 'icon.ico') : null,
    (process as any).resourcesPath ? path.join((process as any).resourcesPath, 'app', 'build', 'icon.ico') : null,
    (process as any).resourcesPath ? path.join((process as any).resourcesPath, 'build', 'icon.ico') : null,
    // 开发环境路径
    path.join(app.getAppPath(), 'build', 'icon.ico'),
    path.join(__dirname, '../../build/icon.ico'),
    path.join(__dirname, '../../../build/icon.ico'),
    path.join(__dirname, '../../../../build/icon.ico'),
  ].filter(Boolean);
  
  console.log('可能的路径列表:');
  for (const p of possiblePaths) {
    if (!p) continue;
    console.log('  -', p);
    try {
      const exists = fs.existsSync(p);
      console.log('    存在:', exists);
      if (exists && !foundPath) {
        foundPath = p;
        console.log('    ✓ 使用此路径');
      }
    } catch (e: any) {
      console.log('    错误:', e.message);
    }
  }
  
  iconPath = foundPath;
  
  if (!iconPath) {
    console.error('❌ 未找到图标文件！');
    // 如果找不到图标，使用空白图标
    tray = new Tray(nativeImage.createEmpty());
    console.warn('使用空白图标');
  } else {
    try {
      console.log('尝试加载图标:', iconPath);
      const trayIcon = nativeImage.createFromPath(iconPath);
      if (trayIcon.isEmpty()) {
        console.error('❌ 图标文件为空或格式不正确');
        tray = new Tray(nativeImage.createEmpty());
      } else {
        const size = trayIcon.getSize();
        console.log('✓ 创建托盘图标成功');
        console.log('  图标尺寸:', `${size.width}x${size.height}`);
        console.log('  图标路径:', iconPath);
        tray = new Tray(trayIcon);
      }
    } catch (error: any) {
      console.error('❌ 创建图标失败:', error);
      tray = new Tray(nativeImage.createEmpty());
    }
  }
  
  tray.setToolTip('WNotes');
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示 WNotes',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          if (mainWindow.isMinimized()) {
            mainWindow.restore();
          }
          mainWindow.focus();
        }
      },
    },
    {
      label: '退出',
      click: () => {
        // 先销毁托盘图标
        if (tray) {
          tray.destroy();
          tray = null;
        }
        // 关闭窗口
        if (mainWindow) {
          mainWindow.close();
        }
        // 退出应用
        app.quit();
      },
    },
  ]);
  
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
  
  console.log('✓ 托盘创建完成');
}

function createWindow(): void {
  const { BrowserWindow } = require('electron');
  
  const preloadPath = path.join(__dirname, 'preload.js');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'WNotes',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(__dirname, '../index.html');
    mainWindow.loadFile(htmlPath);
  }

  // 阻止窗口关闭时退出应用，而是隐藏到系统托盘
  mainWindow.on('close', (event: any) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIpcHandlers(): void {
  const { ipcMain } = require('electron');
  
  ipcMain.handle(IPC_CHANNELS.GET_ALL_NOTES, async () => {
    return database.getAllNotes();
  });

  ipcMain.handle(IPC_CHANNELS.CREATE_NOTE, async (_event: any, id: string, title: string) => {
    const defaultContent = '新笔记内容';
    const filePath = await file.createNoteFile(id, title, defaultContent);
    const note = await database.createNote(id, title, filePath);
    return note;
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_NOTE, async (_event: any, id: string) => {
    const note = database.getAllNotes().find((n: any) => n.id === id);
    if (note) {
      await file.deleteNoteFile(note.filePath);
    }
    return database.deleteNote(id);
  });

  ipcMain.handle(
    IPC_CHANNELS.UPDATE_NOTE,
    async (_event: any, id: string, title: string) => {
      return database.updateNoteTitle(id, title);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.READ_FILE,
    async (_event: any, filePath: string): Promise<string> => {
      return file.readNoteFile(filePath);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WRITE_FILE,
    async (_event: any, filePath: string, content: string): Promise<void> => {
      return file.writeNoteFile(filePath, content);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.SAVE_IMAGE,
    async (_event: any, fileBuffer: Buffer, noteId: string): Promise<string> => {
      return image.saveImage(fileBuffer, noteId);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.SEARCH_NOTES,
    async (_event: any, query: string) => {
      return database.searchNotes(query);
    },
  );
}

const { app } = require('electron');

app.whenReady().then(async () => {
  await file.initializeDirectories();
  registerIpcHandlers();
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {
  // 销毁托盘图标
  if (tray) {
    tray.destroy();
    tray = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前确保销毁托盘图标
app.on('before-quit', () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
