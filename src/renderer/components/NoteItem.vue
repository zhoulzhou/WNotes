
<template>
  <div 
    :class="['note-item', { 'selected': isSelected }]"
    @click="onSelect"
  >
    <div class="note-content">
      <div class="note-title">{{ note.title }}</div>
      <div class="note-time">{{ formattedTime }}</div>
    </div>
    <button 
      class="delete-btn"
      @click.stop="onDelete"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Note } from '../store';
import { formatTime } from '../utils/format';

interface Props {
  note: Note;
  isSelected: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [id: string];
  delete: [id: string];
}>();

const formattedTime = computed(() => formatTime(props.note.updatedAt));

function onSelect() {
  emit('select', props.note.id);
}

function onDelete() {
  if (confirm(`确定要删除笔�?"${props.note.title}" 吗？`)) {
    emit('delete', props.note.id);
  }
}
</script>

<style scoped>
.note-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.note-item:hover {
  background-color: #f5f5f5;
}

.note-item.selected {
  background-color: #e6f7ff;
}

.note-content {
  flex: 1;
  min-width: 0;
}

.note-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #ff4d4f;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
}

.note-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background-color: #ffccc7;
}
</style>
