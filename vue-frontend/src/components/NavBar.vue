<template>
  <nav class="navbar bg-gray-800 p-4">
    <ul class="flex space-x-4">
      <li>
        <router-link to="/" class="text-white hover:text-gray-300">Home</router-link>
      </li>
      <li>
        <router-link to="/edit-prompt" class="text-white hover:text-gray-300">Edit Prompt</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
}
ul {
  display: flex;
  list-style-type: none;
}
li {
  margin-right: 16px;
}
</style>
