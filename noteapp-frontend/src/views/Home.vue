<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <h1>欢迎使用笔记应用</h1>
    <div class="content">
      <Note class="note-section" />
      <AI class="ai-section" />
    </div>
  </div>
</template>

<script>
import Note from '@/components/Note.vue';
import AI from '@/components/AI.vue';

export default {
  components: {
    Note,
    AI,
  },
};
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.content {
  display: flex;
  gap: 20px;
}
.note-section, .ai-section {
  flex: 1;
}
</style>