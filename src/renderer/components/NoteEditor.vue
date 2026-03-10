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
        :preview="false"
        :toolbars="toolbars"
        :drag="true"
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

const toolbars = [
  'bold', 'underline', 'italic', '-', 'title', 'strikeThrough', 'sub', 'sup',
  'quote', 'unorderedList', 'orderedList', 'task', '-', 'codeRow', 'code',
  'link', 'image', 'table', 'mermaid', 'katex', '-', 'revoke', 'next', 'save',
  '=', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview', 'catalog'
];

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

watch(() => content.value, () => { saveNote(); });

watch(() => store.selectedNoteId, async () => {
  await loadNoteContent();
});

async function onUploadImg(files: File[]): Promise<string[]> {
  console.log('===== 开始上传图片 =====');
  console.log('当前笔记 ID:', currentNoteId);
  console.log('文件列表:', files);
  console.log('window.electronAPI:', window.electronAPI);
  
  if (!currentNoteId) {
    console.error('错误：没有当前笔记 ID');
    alert('请先选择或创建一个笔记');
    return [];
  }
  
  if (!window.electronAPI) {
    console.error('错误：electronAPI 未定义');
    alert('系统错误：electronAPI 未定义');
    return [];
  }
  
  const imagePaths: string[] = [];
  
  for (const file of files) {
    console.log('处理文件:', file.name, '类型:', file.type, '大小:', file.size);
    
    if (!file.type.startsWith('image/')) {
      console.warn(`跳过非图片文件：${file.name}`);
      continue;
    }
    
    try {
      console.log('读取文件为 ArrayBuffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer 大小:', arrayBuffer.byteLength);
      
      console.log('转换为 Uint8Array...');
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log('Uint8Array 长度:', uint8Array.length);
      
      console.log('调用 electronAPI.saveImage...');
      const relativePath = await window.electronAPI.saveImage(uint8Array, currentNoteId);
      console.log('返回的相对路径:', relativePath);
      
      const markdownImage = `\n![${file.name}](${relativePath})\n`;
      console.log('生成的 Markdown:', markdownImage);
      imagePaths.push(markdownImage);
      
      console.log(`✓ 图片 ${file.name} 上传成功`);
    } catch (error) {
      console.error('上传图片失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      alert(`上传图片 ${file.name} 失败：${error}`);
    }
  }
  
  console.log('===== 图片上传完成，共上传:', imagePaths.length, '张 =====');
  return imagePaths;
}

async function onDrop(files: File[]): Promise<string[]> {
  console.log('===== 检测到拖拽事件 =====');
  console.log('拖拽的文件:', files);
  console.log('文件数量:', files.length);
  
  if (files.length === 0) {
    console.warn('没有检测到文件');
    return [];
  }
  
  return onUploadImg(files);
}

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

:deep(.md-editor-preview-btn) {
  display: none !important;
}

:deep(.md-editor-content) {
  width: 100% !important;
  border-right: none !important;
}

:deep(.md-editor-preview-wrapper) {
  display: none !important;
}
</style>
