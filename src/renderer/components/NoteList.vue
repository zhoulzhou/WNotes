<template>
  <div class="note-list">
    <div class="header">
      <h1>WNotes</h1>
      <button class="new-note-btn" @click="createNote">
        + 新建笔记
      </button>
    </div>
    <div class="list-container">
      <NoteItem
        v-for="note in store.notes"
        :key="note.id"
        :note="note"
        :is-selected="store.selectedNoteId === note.id"
        @select="selectNote"
        @delete="deleteNote"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '../store';
import NoteItem from './NoteItem.vue';

const store = useStore();

async function createNote() {
  const id = `note-${Date.now()}`;
  const title = '新笔记';
  const result = await window.electronAPI.createNote(id, title);
  store.addNote({
    id: result.id,
    title: result.title,
    filePath: result.filePath,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });
  store.selectNote(id);
}

function selectNote(id: string) {
  store.selectNote(id);
}

async function deleteNote(id: string) {
  await window.electronAPI.deleteNote(id);
  store.removeNote(id);
}

async function loadNotes() {
  const notes = await window.electronAPI.getAllNotes();
  store.setNotes(notes.sort((a, b) => b.updatedAt - a.updatedAt));
}

onMounted(() => {
  loadNotes();
});
</script>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fafafa;
}

.header {
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.new-note-btn {
  width: 100%;
  padding: 8px 16px;
  border: none;
  background-color: #1890ff;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-note-btn:hover {
  background-color: #40a9ff;
}

.list-container {
  flex: 1;
  overflow-y: auto;
}
</style>
