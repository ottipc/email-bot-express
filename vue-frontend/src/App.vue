<template>
  <div id="app">
    <nav>
      <button @click="logout" v-if="isAuthenticated">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>
