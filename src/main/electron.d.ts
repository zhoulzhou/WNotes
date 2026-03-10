export interface ElectronAPI {
  getAllNotes: () => Promise<any[]>;
  createNote: (title: string) => Promise<{ id: string; title: string }>;
  deleteNote: (id: string) => Promise<boolean>;
  updateNote: (id: string, title: string, content: string) => Promise<{ id: string; title: string; content: string }>;
  readNoteFile: (filePath: string) => Promise<string>;
  writeNoteFile: (filePath: string, content: string) => Promise<void>;
  saveImage: (file: Buffer, noteId: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
