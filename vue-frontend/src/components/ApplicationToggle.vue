<template>
  <div class="application-toggle p-4">
    <!-- Schalter -->
    <div class="flex justify-center">
      <button
          @click="toggleApplication"
          :class="{
          'bg-green-500 hover:bg-green-600': isEnabled,
          'bg-red-500 hover:bg-red-600': !isEnabled,
        }"
          class="text-white font-medium py-2 px-4 rounded-lg shadow-md"
      >
        {{ isEnabled ? "Disable Application" : "Enable Application" }}
      </button>
    </div>

    <!-- Nachricht und Fehlermeldung -->
    <div class="mt-4 text-center">
      <p v-if="message" class="text-green-500">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import {
  getApplicationState,
  toggleApplicationState,
} from "@/api/applicationApi";

export default {
  data() {
    return {
      isEnabled: false, // Standardwert
      message: "",
      error: "",
    };
  },
  async mounted() {
    try {
      const data = await getApplicationState(); // Abrufen des aktuellen Status
      this.isEnabled = data.isApplicationEnabled;
    } catch (err) {
      this.error = "Failed to fetch application status. Please try again later.";
    }
  },
  methods: {
    async toggleApplication() {
      try {
        console.log("Sending toggle request...");
        const response = await toggleApplicationState(); // Umschalten des Status
        console.log("API Response:", response);
        this.isEnabled = response.isApplicationEnabled; // Status aus der API setzen
        this.message = response.message;
        this.error = "";
        setTimeout(() => (this.message = ""), 3000); // Nachricht nach 3 Sekunden entfernen
      } catch (err) {
        console.error("Error toggling application status:", err); // Fehler loggen
        this.error = err.message || "Failed to toggle application status. Please try again.";
        this.message = "";
      }
    },
  },
};
</script>

<style scoped>
.application-toggle button {
  transition: all 0.2s ease-in-out;
}
</style>
