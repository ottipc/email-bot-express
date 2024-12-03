<template>
  <div>
    <h1>Welcome to the Dashboard</h1>
    <p>This is a protected page. Only logged-in users can access it.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/login'); // Leite nach dem Logout auf die Login-Seite um
    },
  },
};
</script>
