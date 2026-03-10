import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels';

contextBridge.exposeInMainWorld('electronAPI', {
  getAllNotes: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_NOTES),

  createNote: (id: string, title: string) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_NOTE, id, title),

  deleteNote: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_NOTE, id),

  updateNote: (id: string, title: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_NOTE, id, title),

  readNoteFile: (filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.READ_FILE, filePath),

  writeNoteFile: (filePath: string, content: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.WRITE_FILE, filePath, content),

  saveImage: (file: Buffer, noteId: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_IMAGE, file, noteId),
});
