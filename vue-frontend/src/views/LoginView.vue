<template>
  <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
      <form @submit.prevent="handleLogin">
        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">Username</label>
          <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <!-- Login Button -->
        <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          Login
        </button>
      </form>

      <!-- Link to Register -->
      <p class="text-center text-gray-600 mt-4">
        Don't have an account?
        <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]), // Zugriff auf isAuthenticated
  },
  watch: {
    // Weiterleitung, falls der Benutzer eingeloggt ist
    isAuthenticated(newValue) {
      if (newValue) {
        this.$router.push("/emails"); // Weiterleitung zur HomeView
      }
    },
  },
  mounted() {
    // Falls der Benutzer eingeloggt ist, leite ihn direkt weiter
    if (this.isAuthenticated) {
      this.$router.push("/emails");
    }
  },
  methods: {
    ...mapActions(["login"]), // Vuex-Login-Aktion
    async handleLogin() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid username or password");
        }

        const data = await response.json();
        this.login(data.token); // Speichere den Token im Store
        this.$router.push("/emails"); // Weiterleitung zur HomeView
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
/* Keine zusätzlichen Stile erforderlich, da alles mit Tailwind gestaltet ist */
</style>
