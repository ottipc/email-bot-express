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
  getApplicationStatus,
  toggleApplicationStatus,
} from "@/api/applicationApi";

export default {
  data() {
    return {
      isEnabled: true, // Standardmäßig aktiviert
      message: "",
      error: "",
    };
  },
  async mounted() {
    try {
      const data = await getApplicationStatus();
      this.isEnabled = data.enabled;
    } catch (err) {
      this.error = "Failed to fetch application status.";
    }
  },
  methods: {
    async toggleApplication() {
      try {
        this.isEnabled = !this.isEnabled;
        const response = await toggleApplicationStatus(this.isEnabled);
        this.message = response.message;
        this.error = "";
        setTimeout(() => (this.message = ""), 3000);
      } catch (err) {
        this.error = "Failed to toggle application status.";
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
