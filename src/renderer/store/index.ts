
import { defineStore } from 'pinia';

export interface Note {
  id: string;
  title: string;
  filePath: string;
  updatedAt: number;
  createdAt: number;
}

interface AppState {
  notes: Note[];
  selectedNoteId: string | null;
}

export const useStore = defineStore('main', {
  state: (): AppState => ({
    notes: [],
    selectedNoteId: null,
  }),
  
  actions: {
    setNotes(notes: Note[]) {
      this.notes = notes;
    },
    
    selectNote(noteId: string) {
      this.selectedNoteId = noteId;
    },
    
    updateNoteTitle(id: string, title: string) {
      const note = this.notes.find(n => n.id === id);
      if (note) {
        note.title = title;
        note.updatedAt = Date.now();
        this.notes = [...this.notes].sort((a, b) => b.updatedAt - a.updatedAt);
      }
    },
    
    addNote(note: Note) {
      this.notes.unshift(note);
      this.notes = [...this.notes].sort((a, b) => b.updatedAt - a.updatedAt);
    },
    
    removeNote(id: string) {
      this.notes = this.notes.filter(n => n.id !== id);
      if (this.selectedNoteId === id) {
        this.selectedNoteId = null;
      }
    },
  },
});
