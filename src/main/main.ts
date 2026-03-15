import * as path from 'path';
import { IPC_CHANNELS } from './ipc-channels';
import * as database from './database';
import * as file from './file';
import * as image from './image';

let mainWindow: any = null;
let tray: any = null;

function createTray(): void {
  const { Tray, Menu, nativeImage } = require('electron');
  const iconPath = path.join(__dirname, '../../build/icon.ico');
  const trayIcon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(trayIcon);
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
        if (mainWindow) {
          mainWindow.close();
        }
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
}

const { app } = require('electron');

app.whenReady().then(async () => {
  await file.initializeDirectories();
  registerIpcHandlers();
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
