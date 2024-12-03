<template>
  <div class="home min-h-screen p-6 bg-gray-100 text-center">
    <h1 class="text-3xl font-extrabold mb-6">Welcome to the Email Assistant</h1>
    <div class="flex justify-center space-x-4">
      <!-- Navigation zur Email-Liste -->
      <router-link
          to="/emails"
          class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md"
      >
        Go to Email List
      </router-link>
      <!-- Navigation zum Prompt-Editor -->
      <router-link
          to="/edit-prompt"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
      >
        Edit Prompt
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
