
&lt;template&gt;
  &lt;div class="note-editor"&gt;
    &lt;div v-if="!selectedNote" class="placeholder"&gt;
      &lt;div class="placeholder-text"&gt;请选择或创建笔记&lt;/div&gt;
    &lt;/div&gt;
    &lt;div v-else class="editor-content"&gt;
      &lt;input
        v-model="title"
        class="title-input"
        placeholder="笔记标题"
        @input="onTitleChange"
      /&gt;
      &lt;MdEditor
        v-model="content"
        :onDrop="onDrop"
        :onUploadImg="onUploadImg"
        class="md-editor"
      /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref, computed, watch, onMounted } from 'vue';
import { MdEditor } from 'md-editor-v3';
import { useStore } from '../store';
import { debounce } from '../utils/debounce';

const store = useStore();

const title = ref('');
const content = ref('');
let currentNoteId: string | null = null;

const selectedNote = computed(() =&gt; 
  store.notes.find(n =&gt; n.id === store.selectedNoteId)
);

async function loadNoteContent() {
  if (!store.selectedNoteId) return;
  
  const note = store.notes.find(n =&gt; n.id === store.selectedNoteId);
  if (!note) return;
  
  currentNoteId = note.id;
  title.value = note.title;
  const fileContent = await window.electronAPI.readNoteFile(note.filePath);
  content.value = fileContent;
}

const saveNote = debounce(async () =&gt; {
  if (!currentNoteId) return;
  
  const note = store.notes.find(n =&gt; n.id === currentNoteId);
  if (!note) return;
  
  await window.electronAPI.writeNoteFile(note.filePath, content.value);
  await window.electronAPI.updateNote(currentNoteId, title.value);
  store.updateNoteTitle(currentNoteId, title.value);
}, 500);

function onTitleChange() {
  saveNote();
}

watch(
  () =&gt; content.value,
  () =&gt; {
    saveNote();
  }
);

watch(
  () =&gt; store.selectedNoteId,
  async () =&gt; {
    await loadNoteContent();
  }
);

async function onUploadImg(files: File[]): Promise&lt;string[]&gt; {
  if (!currentNoteId) return [];
  
  const promises = files.map(async (file) =&gt; {
    const buffer = Buffer.from(await file.arrayBuffer());
    const relativePath = await window.electronAPI.saveImage(buffer, currentNoteId);
    return relativePath;
  });
  
  return Promise.all(promises);
}

async function onDrop(files: File[]): Promise&lt;string[]&gt; {
  return onUploadImg(files);
}

onMounted(() =&gt; {
  loadNoteContent();
});
&lt;/script&gt;

&lt;style scoped&gt;
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
&lt;/style&gt;
