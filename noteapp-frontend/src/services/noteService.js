// src/services/noteService.js
import httpClient from './httpClient';

export default {
  async getNotes(userId) {
    // 这里 httpClient.get 已经直接返回后端的 data 了
    const data = await httpClient.get(`/notes?userId=${userId}`);
    return Array.isArray(data.data) ? data.data : [];
  },

  async addNote(userId, content) {
    const data = await httpClient.post('/notes', { userId, content });
    return data.data;
  },

  async deleteNote(noteId) {
    await httpClient.delete(`/notes/${noteId}`);
  },

  async deleteAllNotes(userId) {
    await httpClient.delete(`/notes/user/${userId}`);
  },
};
