import { contextBridge, ipcRenderer } from 'electron';

const IPC_CHANNELS = {
  GET_ALL_NOTES: 'get-all-notes',
  CREATE_NOTE: 'create-note',
  DELETE_NOTE: 'delete-note',
  UPDATE_NOTE: 'update-note',
  READ_FILE: 'read-file',
  WRITE_FILE: 'write-file',
  SAVE_IMAGE: 'save-image',
  SEARCH_NOTES: 'search-notes',
};

contextBridge.exposeInMainWorld('electronAPI', {
  getAllNotes: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_NOTES),
  createNote: (id: string, title: string) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_NOTE, id, title),
  deleteNote: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_NOTE, id),
  updateNote: (id: string, title: string) => ipcRenderer.invoke(IPC_CHANNELS.UPDATE_NOTE, id, title),
  readNoteFile: (filePath: string) => ipcRenderer.invoke(IPC_CHANNELS.READ_FILE, filePath),
  writeNoteFile: (filePath: string, content: string) => ipcRenderer.invoke(IPC_CHANNELS.WRITE_FILE, filePath, content),
  saveImage: (file: ArrayBuffer, noteId: string) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_IMAGE, Buffer.from(file), noteId),
  searchNotes: (query: string) => ipcRenderer.invoke(IPC_CHANNELS.SEARCH_NOTES, query),
});
