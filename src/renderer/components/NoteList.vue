<template>
  <div class="note-list">
    <div class="header">
      <h1>WNotes</h1>
      <button class="new-note-btn" @click="createNote">
        + 新建笔记
      </button>
    </div>
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索笔记标题和内容..."
        @input="searchNotes"
      />
    </div>
    <div class="error" v-if="error">{{ error }}</div>
    <div class="list-container">
      <NoteItem
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        :is-selected="store.selectedNoteId === note.id"
        @select="selectNote"
        @delete="deleteNote"
      />
      <div v-if="filteredNotes.length === 0 && searchQuery" class="no-results">
        未找到匹配的笔记
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../store';
import NoteItem from './NoteItem.vue';

const store = useStore();
const error = ref('');
const searchQuery = ref('');
const searchResults = ref<any[]>([]);

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) {
    return store.notes.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return searchResults.value;
});

async function createNote() {
  error.value = '';
  console.log('Creating note...');
  console.log('window.electronAPI:', window.electronAPI);
  
  if (!window.electronAPI) {
    error.value = 'electronAPI 未定义，请检查 preload 脚本';
    console.error('electronAPI is undefined');
    return;
  }
  
  try {
    const id = `note-${Date.now()}`;
    const title = '新笔记标题';
    console.log('Calling createNote API...');
    const result = await window.electronAPI.createNote(id, title);
    console.log('createNote result:', result);
    
    store.addNote({
      id: result.id,
      title: result.title,
      filePath: result.filePath,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });
    store.selectNote(id);
    console.log('Note added to store');
  } catch (e: any) {
    error.value = '创建笔记失败：' + e.message;
    console.error('Error creating note:', e);
  }
}

function selectNote(id: string) {
  store.selectNote(id);
}

async function deleteNote(id: string) {
  await window.electronAPI.deleteNote(id);
  store.removeNote(id);
}

async function searchNotes() {
  const query = searchQuery.value.trim();
  
  if (!query) {
    searchResults.value = [];
    return;
  }
  
  try {
    const results = await window.electronAPI.searchNotes(query);
    searchResults.value = results;
  } catch (e: any) {
    error.value = '搜索失败：' + e.message;
    console.error('Error searching notes:', e);
  }
}

async function loadNotes() {
  try {
    const notes = await window.electronAPI.getAllNotes();
    store.setNotes(notes);
  } catch (e: any) {
    error.value = '加载笔记失败：' + e.message;
    console.error('Error loading notes:', e);
  }
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

.search-box {
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1890ff;
}

.search-input::placeholder {
  color: #bfbfbf;
}

.list-container {
  flex: 1;
  overflow-y: auto;
}

.error {
  padding: 8px 16px;
  background-color: #fff2f0;
  border-left: 3px solid #ff4d4f;
  color: #ff4d4f;
  font-size: 12px;
}

.no-results {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
