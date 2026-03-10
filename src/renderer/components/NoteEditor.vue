<template>
  <div class="note-editor">
    <div v-if="!selectedNote" class="placeholder">
      <div class="placeholder-text">请选择或创建笔记</div>
    </div>
    <div v-else class="editor-content">
      <input
        v-model="title"
        class="title-input"
        placeholder="笔记标题"
        @input="onTitleChange"
      />
      <MdEditor
        v-model="content"
        :onDrop="onDrop"
        :onUploadImg="onUploadImg"
        class="md-editor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { MdEditor } from 'md-editor-v3';
import { useStore } from '../store';
import { debounce } from '../utils/debounce';

const store = useStore();

const title = ref('');
const content = ref('');
let currentNoteId: string | null = null;

const selectedNote = computed(() => 
  store.notes.find(n => n.id === store.selectedNoteId)
);

async function loadNoteContent() {
  if (!store.selectedNoteId) return;
  
  const note = store.notes.find(n => n.id === store.selectedNoteId);
  if (!note) return;
  
  currentNoteId = note.id;
  title.value = note.title;
  const fileContent = await window.electronAPI.readNoteFile(note.filePath);
  content.value = fileContent;
}

const saveNote = debounce(async () => {
  if (!currentNoteId) return;
  
  const note = store.notes.find(n => n.id === currentNoteId);
  if (!note) return;
  
  await window.electronAPI.writeNoteFile(note.filePath, content.value);
  await window.electronAPI.updateNote(currentNoteId, title.value);
  store.updateNoteTitle(currentNoteId, title.value);
}, 500);

function onTitleChange() {
  saveNote();
}

watch(
  () => content.value,
  () => {
    saveNote();
  }
);

watch(
  () => store.selectedNoteId,
  async () => {
    await loadNoteContent();
  }
);

async function onUploadImg(files: File[]): Promise<string[]> {
  if (!currentNoteId) return [];
  
  const promises = files.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const relativePath = await window.electronAPI.saveImage(buffer, currentNoteId);
    return relativePath;
  });
  
  return Promise.all(promises);
}

async function onDrop(files: File[]): Promise<string[]> {
  return onUploadImg(files);
}

onMounted(() => {
  loadNoteContent();
});
</script>

<style scoped>
.note-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 18px;
  color: #999;
}

.editor-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  overflow: hidden;
}

.title-input {
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  border: none;
  outline: none;
  padding: 8px 0;
  margin-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
  transition: border-color 0.2s;
}

.title-input:focus {
  border-bottom-color: #1890ff;
}

.md-editor {
  flex: 1;
  overflow: auto;
}

:deep(.md-editor) {
  height: 100%;
  border: none;
}

:deep(.md-editor-container) {
  height: 100%;
}
</style>
