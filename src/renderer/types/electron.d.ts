
export {};

declare global {
  interface Window {
    electronAPI: {
      getAllNotes: () => Promise<any[]>;
      createNote: (id: string, title: string) => Promise<any>;
      deleteNote: (id: string) => Promise<void>;
      updateNote: (id: string, title: string) => Promise<void>;
      readNoteFile: (filePath: string) => Promise<string>;
      writeNoteFile: (filePath: string, content: string) => Promise<void>;
      saveImage: (file: Buffer, noteId: string) => Promise<string>;
    };
  }
}
