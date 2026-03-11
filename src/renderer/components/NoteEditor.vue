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
      <div
        ref="editorRef"
        class="content-editor"
        contenteditable="true"
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        @input="onContentChange"
        @paste="handlePaste"
        @drop="handleDrop"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useStore } from '../store';
import { debounce } from '../utils/debounce';

const store = useStore();
const editorRef = ref<HTMLElement | null>(null);
const title = ref('');
const content = ref('');
let currentNoteId: string | null = null;
let isInternalChange = false;

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
  
  await nextTick();
  if (editorRef.value) {
    editorRef.value.innerHTML = fileContent;
  }
}

const saveNote = debounce(async () => {
  if (!currentNoteId) return;
  const note = store.notes.find(n => n.id === currentNoteId);
  if (!note) return;
  
  const htmlContent = editorRef.value?.innerHTML || '';
  await window.electronAPI.writeNoteFile(note.filePath, htmlContent);
  await window.electronAPI.updateNote(currentNoteId, title.value);
  store.updateNoteTitle(currentNoteId, title.value);
}, 500);

function onTitleChange() {
  saveNote();
}

function onContentChange() {
  saveNote();
}

async function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  
  const items = event.clipboardData?.items;
  if (!items) return;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      if (file) {
        await insertImage(file);
      }
    } else if (item.type.indexOf('text/plain') !== -1) {
      item.getAsString((text) => {
        document.execCommand('insertText', false, text);
      });
    }
  }
}

async function handleDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  
  console.log('===== 检测到拖拽事件 =====');
  console.log('DataTransfer items:', event.dataTransfer?.items);
  console.log('Files:', event.dataTransfer?.files);
  
  const items = event.dataTransfer?.items;
  if (!items) return;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log('处理 item:', item.kind, item.type);
    
    if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      console.log('获取到文件:', file?.name, file?.type);
      if (file) {
        await insertImage(file);
      }
    }
  }
}

async function insertImage(file: File) {
  console.log('插入图片:', file.name, file.type, file.size);
  
  if (!currentNoteId) {
    alert('请先选择或创建一个笔记');
    return;
  }
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const relativePath = await window.electronAPI.saveImage(uint8Array, currentNoteId);
    
    console.log('图片保存成功:', relativePath);
    
    const img = document.createElement('img');
    img.src = relativePath;
    img.alt = file.name;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '10px 0';
    
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    if (range) {
      range.deleteContents();
      range.insertNode(img);
      range.collapse(false);
      
      const br = document.createElement('br');
      range.insertNode(br);
      range.collapse(false);
    } else if (editorRef.value) {
      editorRef.value.appendChild(img);
      editorRef.value.appendChild(document.createElement('br'));
    }
    
    console.log('✓ 图片插入成功');
    onContentChange();
  } catch (error) {
    console.error('插入图片失败:', error);
    alert(`插入图片 ${file.name} 失败：${error}`);
  }
}

watch(() => store.selectedNoteId, async () => {
  await loadNoteContent();
});

onMounted(() => {
  console.log('NoteEditor 组件已挂载');
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

.content-editor {
  flex: 1;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
  padding: 10px 0;
}

.content-editor:empty:before {
  content: '在此输入笔记内容...';
  color: #999;
}

.content-editor img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
}

.content-editor img:hover {
  opacity: 0.9;
}
</style>
