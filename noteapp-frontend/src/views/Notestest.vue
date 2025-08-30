<template>
  <div class="notes-container">
    <h1>我的笔记</h1>
    <div class="notes-actions">
      <button @click="notes.showAddModal = true">添加笔记</button>
    </div>
    <ul class="note-list">
      <li v-for="note in notes.list" :key="note.id" class="note-item">
        <span>{{ note.title }} - {{ note.content }}</span>
        <button @click="deleteNote(note.id)" class="delete-btn">删除</button>
      </li>
    </ul>
    <!-- 添加笔记模态框 -->
    <div v-if="notes.showAddModal" class="modal">
      <div class="modal-content">
        <h2>添加新笔记</h2>
        <input v-model="notes.newNote.title" placeholder="标题" />
        <textarea v-model="notes.newNote.content" placeholder="内容"></textarea>
        <button @click="saveNewNote" :disabled="isLoading">保存</button>
        <button @click="notes.showAddModal = false" :disabled="isLoading">取消</button>
      </div>
    </div>
    <div class="ai-actions">
      <div class="search-section">
        <input v-model="ai.query" :placeholder="`至少 ${config.ai.analysis.minContentLength} 个字符`" />
        <button @click="searchNotes" :disabled="isLoading">AI 搜索</button>
        <p>{{ ai.searchResult }}</p>
      </div>
      <button @click="summarizeNotes" :disabled="isLoading">总结笔记</button>
      <p>{{ ai.summary }}</p>
      <div class="question-section">
        <input v-model="ai.question" :placeholder="`至少 ${config.ai.analysis.minContentLength} 个字符`" />
        <button @click="askQuestion" :disabled="isLoading">智能问答</button>
        <p>{{ ai.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { config, errorCodes } from '../services/config';

export default {
  data() {
    return {
      auth: {
        userInfo: JSON.parse(localStorage.getItem(config.auth.userKey)) || null,
      },
      notes: {
        list: [],
        showAddModal: false,
        newNote: {
          title: '',
          content: '',
        },
      },
      ai: {
        query: '',
        searchResult: '',
        summary: '',
        question: '',
        answer: '',
      },
      isLoading: false,
      config,
    };
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem(config.auth.userKey));
    if (userInfo?.userId) {
      this.getNotes();
    } else {
      this.$router.push('/');
    }
  },
  methods: {
    async getNotes() {
  try {
    this.isLoading = true;
    if (!this.$axios) throw new Error('Axios 未定义');
    const userId = this.auth.userInfo?.userId;
    if (!userId) return; // 用户未登录，不拉取笔记
    const response = await this.$axios.get(`/notes/${userId}`);
    // 如果返回空数据，也不报错
    this.notes.list = response.data?.data || [];
  } catch (error) {
    // 区分网络错误和无数据
    if (!error.response) {
      // 网络或服务器问题，才提示
      console.error('获取笔记失败:', error);
      this.$message.error('获取笔记失败，请稍后重试');
    } else {
      // 如果只是返回空或 404，可以默默处理，不提示
      this.notes.list = [];
    }
  } finally {
    this.isLoading = false;
  }
}
,
    async saveNewNote() {
      if (!this.validateNote()) return;
      this.isLoading = true;
      try {
        const userInfo = this.auth.userInfo;
        await this.$axios.post('/notes', {
          userId: userInfo.userId,
          title: this.notes.newNote.title,
          content: this.notes.newNote.content,
        });
        await this.getNotes();
        this.notes.showAddModal = false;
        this.resetNewNote();
        this.$message.success('笔记添加成功');
      } catch (error) {
        this.handleError(error, '添加笔记失败');
      } finally {
        this.isLoading = false;
      }
    },
    validateNote() {
      if (!this.notes.newNote.title || !this.notes.newNote.content) {
        this.$message.error('标题和内容不能为空');
        return false;
      }
      if (this.notes.newNote.content.length < this.config.ai.analysis.minContentLength) {
        this.$message.error(`内容需至少 ${this.config.ai.analysis.minContentLength} 个字符`);
        return false;
      }
      return true;
    },
    resetNewNote() {
      this.notes.newNote.title = '';
      this.notes.newNote.content = '';
    },
    async deleteNote(noteId) {
      if (!confirm('确定删除此笔记？')) return;
      this.isLoading = true;
      try {
        await this.$axios.delete(`/notes/${noteId}`);
        await this.getNotes();
        this.$message.success('笔记删除成功');
      } catch (error) {
        this.handleError(error, '删除笔记失败');
      } finally {
        this.isLoading = false;
      }
    },
    async searchNotes() {
      if (this.ai.query.length < this.config.ai.analysis.minContentLength) {
        this.$message.error(`查询内容需至少 ${this.config.ai.analysis.minContentLength} 个字符`);
        return;
      }
      this.isLoading = true;
      try {
        const userInfo = JSON.parse(localStorage.getItem(config.auth.userKey));
        const response = await this.$axios.post(`${this.config.ai.baseUrl}${this.config.ai.endpoints.analyze}/${userInfo.userId}`, {
          query: this.ai.query,
        });
        this.ai.searchResult = response.data.data?.analysis?.summary || '无结果';
      } catch (error) {
        this.handleError(error, 'AI 搜索失败');
      } finally {
        this.isLoading = false;
      }
    },
    async summarizeNotes() {
      this.isLoading = true;
      try {
        const userInfo = JSON.parse(localStorage.getItem(config.auth.userKey));
        const response = await this.$axios.get(`${this.config.ai.baseUrl}${this.config.ai.endpoints.summarize}/${userInfo.userId}`);
        this.ai.summary = response.data.data?.analysis?.summary || '无结果';
      } catch (error) {
        this.handleError(error, '总结笔记失败');
      } finally {
        this.isLoading = false;
      }
    },
    async askQuestion() {
      if (this.ai.question.length < this.config.ai.analysis.minContentLength) {
        this.$message.error(`问题内容需至少 ${this.config.ai.analysis.minContentLength} 个字符`);
        return;
      }
      this.isLoading = true;
      try {
        const userInfo = JSON.parse(localStorage.getItem(config.auth.userKey));
        const response = await this.$axios.post(`${this.config.ai.baseUrl}${this.config.ai.endpoints.chat.replace('{userId}', userInfo.userId)}`, {
          question: this.ai.question,
        });
        this.ai.answer = response.data.data?.analysis?.summary || '无结果';
      } catch (error) {
        this.handleError(error, '智能问答失败');
      } finally {
        this.isLoading = false;
      }
    },
    handleError(error, message) {
  console.error(`${message}:`, error);
  const response = error.response;
  if (response) {
    const data = response.data;
    if (data && (data.code === errorCodes.TOKEN_EXPIRED || data.code === errorCodes.TOKEN_INVALID)) {
      alert('登录已过期，请重新登录');
      this.$router.push('/');
    } else if (data && data.code === errorCodes.CONTENT_TOO_SHORT) {
      alert(`输入内容需至少 ${this.config.ai.analysis.minContentLength} 个字符`);
    } else {
      alert(`${message}，请稍后重试`);
    }
  } else {
    alert(`${message}，网络连接可能有问题，请检查后重试`);
  }
},
  },
};
</script>

<style scoped>
.notes-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.notes-actions, .ai-actions {
  margin-bottom: 20px;
}
.note-list {
  list-style: none;
  padding: 0;
}
.note-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.delete-btn:hover {
  background-color: #cc0000;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
}
.modal-content input, .modal-content textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-content textarea {
  height: 100px;
  resize: vertical;
}
.modal-content button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-content button:first-child {
  background-color: #28a745;
  color: white;
}
.modal-content button:last-child {
  background-color: #6c757d;
  color: white;
}
.modal-content button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.search-section, .question-section {
  margin-bottom: 20px;
}
.search-section input, .question-section input {
  padding: 8px;
  width: 200px;
  margin-right: 10px;
}
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>