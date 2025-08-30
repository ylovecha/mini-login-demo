import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
});

api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem(config.auth.userKey));
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export const getNotes = async (userId) => {
  const response = await api.get(`/notes/${userId}`);
  return response.data.data || [];
};

export const createNote = async (userId, note) => {
  await api.post('/notes', { userId, ...note });
};

export const deleteNote = async (noteId) => {
  await api.delete(`/notes/${noteId}`);
};

export const analyzeNotes = async (userId, query) => {
  const response = await api.post(`${config.ai.baseUrl}${config.ai.endpoints.analyze}/${userId}`, { query });
  return response.data.data?.analysis?.summary || '无结果';
};

export const summarizeNotes = async (userId) => {
  const response = await api.get(`${config.ai.baseUrl}${config.ai.endpoints.summarize}/${userId}`);
  return response.data.data?.analysis?.summary || '无结果';
};

export const askQuestion = async (userId, question) => {
  const response = await api.post(`${config.ai.baseUrl}${config.ai.endpoints.chat.replace('{userId}', userId)}`, { question });
  return response.data.data?.analysis?.summary || '无结果';
};