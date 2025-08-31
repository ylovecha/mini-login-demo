<!-- src/components/AI.vue -->
<template>
  <div class="ai-container">
    <h2>AI 助手</h2>
    <div>
      <input v-model="inputText" placeholder="输入文本以获取AI生成内容" />
      <button @click="generateAIContent">生成内容</button>
    </div>
    <div v-if="aiOutput" class="ai-output">
      <p><strong>生成内容：</strong>{{ aiOutput }}</p>
    </div>
  </div>
</template>

<script>
import NoteService from '@/services/noteService';

export default {
  data() {
    return {
      inputText: '',
      aiOutput: '',
    };
  },
  methods: {
    async generateAIContent() {
      if (!this.inputText) {
        alert('请输入文本');
        return;
      }
      try {
        const summary = await NoteService.summarizeNote(this.inputText);
        this.aiOutput = summary.summary || '生成内容为空';
      } catch (error) {
        console.error('AI 生成失败：', error.message);
        alert('AI 生成失败：' + error.message);
      }
    },
  },
};
</script>

<style scoped>
.ai-container {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.ai-output {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 3px;
}
</style>