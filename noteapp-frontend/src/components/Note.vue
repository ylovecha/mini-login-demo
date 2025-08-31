<!-- src/components/Note.vue -->
<template>
  <div class="note-container">
    <h2>我的笔记</h2>
    <div>
      <input v-model="newNoteContent" placeholder="输入笔记内容" />
      <button @click="addNote">添加笔记</button>
      <button @click="deleteAllNotes" style="margin-left: 10px;">删除全部笔记</button>
    </div>
    <div v-for="note in notes" :key="note.id" class="note-item">
      <p>{{ note.content }}</p>
      <button @click="deleteNote(note.id)">删除</button>
    </div>
  </div>
</template>

<script>
import NoteService from '@/services/noteService';

export default {
  data() {
    return {
      newNoteContent: '',
      notes: [],
    };
  },
  async created() {
    await this.fetchNotes();
  },
  methods: {
    async fetchNotes() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('用户未登录，请先登录');
        }
        const notes = await NoteService.getNotes(userId);
        this.notes = notes.map(note => ({
          id: note.id,
          userId: note.userId,
          content: note.content,
          createdDate: note.createdDate || null,
          updatedDate: note.updatedDate || null
        }));
      } catch (error) {
        console.error('获取笔记失败：', error.message);
        alert(error.message);
        this.notes = [];
      }
    },
    async addNote() {
      if (!this.newNoteContent) {
        alert('笔记内容不能为空');
        return;
      }
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('用户未登录，请先登录');
        }
        const response = await NoteService.addNote(userId, this.newNoteContent);
        this.notes.push({
          id: response,
          userId,
          content: this.newNoteContent,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        });
        this.newNoteContent = '';
        await this.fetchNotes(); // 刷新列表
      } catch (error) {
        console.error('添加笔记失败：', error.message);
        alert(error.message);
      }
    },
    async deleteNote(noteId) {
      try {
        await NoteService.deleteNote(noteId);
        this.notes = this.notes.filter(note => note.id !== noteId);
      } catch (error) {
        console.error('删除笔记失败：', error.message);
        alert('删除笔记失败：' + error.message);
      }
    },
    async deleteAllNotes() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('用户未登录，请先登录');
        }
        if (confirm('确定删除所有笔记？此操作不可逆！')) {
          await NoteService.deleteAllNotes(userId);
          this.notes = [];
        }
      } catch (error) {
        console.error('删除全部笔记失败：', error.message);
        alert('删除全部笔记失败：' + error.message);
      }
    },
  },
};
</script>

<style scoped>
.note-container { margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 5px; }
.note-item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
</style>