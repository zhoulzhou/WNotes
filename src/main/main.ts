import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { IPC_CHANNELS } from './ipc-channels';
import * as database from './database';
import * as file from './file';
import * as image from './image';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'WNotes',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.GET_ALL_NOTES, async () =&gt; {
    return database.getAllNotes();
  });

  ipcMain.handle(IPC_CHANNELS.CREATE_NOTE, async (_event, id: string, title: string) =&gt; {
    const filePath = await file.createNoteFile(id, title);
    await database.createNote(id, title, filePath);
    return { id, title, filePath };
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_NOTE, async (_event, id: string) =&gt; {
    const note = database.getAllNotes().find(n =&gt; n.id === id);
    if (note) {
      await file.deleteNoteFile(note.filePath);
    }
    return database.deleteNote(id);
  });

  ipcMain.handle(
    IPC_CHANNELS.UPDATE_NOTE,
    async (_event, id: string, title: string) =&gt; {
      return database.updateNoteTitle(id, title);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.READ_FILE,
    async (_event, filePath: string): Promise&lt;string&gt; =&gt; {
      return file.readNoteFile(filePath);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WRITE_FILE,
    async (_event, filePath: string, content: string): Promise&lt;void&gt; =&gt; {
      return file.writeNoteFile(filePath, content);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.SAVE_IMAGE,
    async (_event, fileBuffer: Buffer, noteId: string): Promise&lt;string&gt; =&gt; {
      return image.saveImage(fileBuffer, noteId);
    },
  );
}

app.whenReady().then(async () =&gt; {
  await file.initializeDirectories();
  registerIpcHandlers();
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
