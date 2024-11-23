<template>
  <div class="home">
    <h1>Willkommen beim E-Mail-Antwort-Generator</h1>
    <EmailForm />
  </div>
</template>

<script>
import EmailForm from '@/components/EmailForm.vue';

export default {
  components: {
    EmailForm,
  },
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}

h1 {
  color: #333;
}
</style>
