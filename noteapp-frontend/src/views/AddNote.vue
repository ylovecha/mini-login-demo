<template>
  <div>
    <input v-model="title" placeholder="标题" />
    <textarea v-model="content" placeholder="内容"></textarea>
    <button @click="addNote">保存</button>
  </div>
</template>

<script>
export default {
  data() {
    return { title: '', content: '' };
  },
  methods: {
    async addNote() {
      const userId = localStorage.getItem('userId');
      await this.$axios.post('/notes', { userId, title: this.title, content: this.content });
      this.$router.push('/notes');
    }
  }
};
</script>