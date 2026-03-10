
&lt;template&gt;
  &lt;div class="app-container"&gt;
    &lt;div class="left-panel"&gt;
      &lt;NoteList /&gt;
    &lt;/div&gt;
    &lt;div class="right-panel"&gt;
      &lt;NoteEditor /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import NoteList from './components/NoteList.vue';
import NoteEditor from './components/NoteEditor.vue';
&lt;/script&gt;

&lt;style scoped&gt;
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.left-panel {
  width: 300px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
&lt;/style&gt;
