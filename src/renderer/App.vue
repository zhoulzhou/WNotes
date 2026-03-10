<template>
  <div class="app-container">
    <div class="left-panel">
      <NoteList />
    </div>
    <div class="right-panel">
      <NoteEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
import NoteList from './components/NoteList.vue';
import NoteEditor from './components/NoteEditor.vue';
</script>

<style scoped>
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
</style>
