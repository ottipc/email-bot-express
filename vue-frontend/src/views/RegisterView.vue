<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>
      <form @submit.prevent="handleRegister">
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

        <!-- Confirm Password -->
        <div class="mb-4">
          <label for="confirm-password" class="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <!-- Register Button -->
        <button
            type="submit"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition"
        >
          Register
        </button>
      </form>

      <!-- Link to Login -->
      <p class="text-center text-gray-600 mt-4">
        Already have an account?
        <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_BASE_URL
import returnReadableStream from "@/utils/utils.js"
export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match.";
        return;
      }

      try {
        const response = await fetch(API_URL + "/api/auth/register", {
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
          // Antwort lesen und Fehler extrahieren
          const errorText = await returnReadableStream(response.body);
          let errorData;

          try {
            errorData = JSON.parse(errorText); // Versuche die Antwort zu parsen
          } catch (parsingError) {
            console.error("Failed to parse error response:", parsingError);
          }

          // Fallback auf "message" oder Textinhalt, falls "error" nicht existiert
          const errorMessage = errorData?.error || errorData?.message || errorText || "Unknown error occurred";
          throw new Error(errorMessage);
        }
        const data = await response.json(); // Erfolgreiche Antwort
        console.log("Registration successful:", data.message);
        this.$router.push("/"); // Weiterleitung zur Login-Seite
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
