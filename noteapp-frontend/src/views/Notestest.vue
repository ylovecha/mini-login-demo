<!-- src/views/Home.vue -->
<template>
  <div>
    <h2>我的笔记</h2>
    <div>
      <input v-model="newNoteContent" placeholder="输入笔记内容" />
      <button @click="addNote">添加笔记</button>
    </div>
    <div v-for="note in notes" :key="note.id">
      <p>{{ note.content }}</p>
      <button @click="deleteNote(note.id)">删除</button>
      <button @click="summarizeNote(note.id)">总结</button>
      <div v-if="note.summary">
        <p><strong>总结：</strong>{{ note.summary }}</p>
        <p><strong>关键词：</strong>{{ note.keywords }}</p>
      </div>
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
    this.notes = Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.error('获取笔记失败：', error.message);
    alert('获取笔记失败：' + error.message);
    this.notes = []; // 出错时重置为数组
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
    if (!Array.isArray(this.notes)) {
      this.notes = []; // 确保 notes 是数组
    }
    const tempId = Date.now();
    const newNote = { id: tempId, content: this.newNoteContent, userId };
    this.notes.push(newNote);
    localStorage.setItem('notesBackup', JSON.stringify(this.notes));
    const response = await NoteService.addNote(userId, this.newNoteContent);
    this.notes = this.notes.map((note) =>
      note.id === tempId ? { ...note, id: response.id } : note
    );
    this.newNoteContent = '';
    await this.fetchNotes();
  } catch (error) {
    console.error('添加笔记失败：', error.message);
    alert('添加笔记失败：' + error.message);
  }
},
    async deleteNote(noteId) {
      try {
        await NoteService.deleteNote(noteId);
        this.notes = this.notes.filter((note) => note.id !== noteId);
      } catch (error) {
        alert('删除笔记失败：' + error.message);
      }
    },
    async summarizeNote(noteId) {
      try {
        const note = this.notes.find((n) => n.id === noteId);
        const summary = await NoteService.summarizeNote(note.content);
        this.notes = this.notes.map((n) =>
          n.id === noteId ? { ...n, summary: summary.summary, keywords: summary.keywords } : n
        );
      } catch (error) {
        alert('总结笔记失败：' + error.message);
      }
    },
  },
};
</script>