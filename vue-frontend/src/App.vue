<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <nav class="bg-blue-600 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-white text-xl font-bold">Email Secretary</h1>
        <button
            @click="logout"
            v-if="isAuthenticated"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
        >
          Logout
        </button>
      </div>
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
