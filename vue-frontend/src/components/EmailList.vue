<template>
  <div v-if="isAuthenticated" class="email-list min-h-screen p-6 bg-gray-100">
    <div :class="['email-list min-h-screen p-6', darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900']">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-extrabold">📧 Email List</h1>
        <!-- Dark Mode Toggle -->
        <button
            @click="toggleDarkMode"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>

        <div class="flex justify-between items-center mb-4">
          <!-- Link zum PromptEditor -->
          <router-link
              to="/edit-prompt"
              class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Go to Prompt Editor
          </router-link>
        </div>
      </div>
      <!-- Automatic Response Toggle -->
      <div class="flex justify-end mb-6">
        <button
            @click="toggleAutomaticResponse"
            :class="{
          'bg-green-500 hover:bg-green-600': !isAutomaticResponseActive,
          'bg-red-500 hover:bg-red-600': isAutomaticResponseActive,
        }"
            class="text-white font-semibold py-2 px-6 rounded-md shadow-lg transform transition hover:scale-105 focus:outline-none"
        >
          {{ isAutomaticResponseActive ? "Disable Automatic Response" : "Enable Automatic Response" }}
        </button>
      </div>

      <!-- Application Toggle -->
      <div class="flex justify-end mb-6">
        <application-toggle></application-toggle>
      </div>

      <!-- List of Emails -->
      <div class="space-y-6">
        <div
            v-for="email in emails"
            :key="email._id"
            class="email-item bg-white dark:bg-gray-800 shadow-xl p-6 rounded-md hover:shadow-2xl transition"
        >
          <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200">{{ email.subject }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <strong>From:</strong> {{ email.sender }}
          </p>
          <div class="mt-2 text-gray-600 dark:text-gray-300">
            <strong>Body:</strong>
            <p class="whitespace-pre-wrap">{{ email.body }}</p>
          </div>

          <!-- Antwort anzeigen, falls vorhanden -->
          <div
              v-if="email.replyBody"
              class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 border rounded-md"
          >
            <h4 class="font-semibold text-blue-600 dark:text-blue-300">Reply:</h4>
            <p class="whitespace-pre-wrap">{{ email.replyBody }}</p>
          </div>

          <!-- Buttons -->
          <div class="mt-4 flex gap-4">
            <button
                v-if="!email.replyBody"
                @click="generateReply(email._id)"
                :disabled="isLoading[email._id]"
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md transform transition hover:scale-105"
            >
              <span v-if="isLoading[email._id]">🔄 Generating...</span>
              <span v-else>Generate Reply</span>
            </button>


            <button
                @click="deleteEmail(email._id)"
                class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-md transform transition hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Reply Popup -->
      <reply-popup
          v-if="showPopup"
          :email-id="selectedEmailId"
          :initial-reply="popupReply"
          @close="closePopup"
          @send="sendReply"
      />
    </div>
  </div>
</template>

<script>
import ReplyPopup from "./ReplyPopup.vue";
import ApplicationToggle from "@/components/ApplicationToggle.vue";
import { mapGetters } from "vuex";
const API_URL = process.env.VUE_APP_API_BASE_URL
console.log("API URL in EMAILLIST : "+ API_URL)
export default {
  name: "EmailList",
  components: {ReplyPopup,ApplicationToggle},
  data() {
    return {
      emails: [],
      isAutomaticResponseActive: true,
      showPopup: false,
      selectedEmailId: null,
      popupReply: "",
      darkMode: false,
      isLoading: {}, // Initialisierung als leeres Objekt
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]), // Vuex-Getter korrekt einbinden
  },
  watch: {
    // Überwache Änderungen in der Authentifizierung
    isAuthenticated(newValue) {
      if (!newValue) {
        this.$router.push("/"); // Weiterleitung zur Login-Seite
      }
    },
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push("/");
    }
    this.fetchEmails();
    this.getAutomaticResponseState();
    this.darkMode = localStorage.getItem("darkMode") === "true";
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode);
    },
    async deleteEmail(emailId) {
      try {
        const response = await fetch(API_URL +`/api/email/${emailId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete email");
        alert("Email is deleted successfully!")
        this.fetchEmails();
      } catch (error) {
        console.error(error.message);
      }
    },
    async getAutomaticResponseState() {
      try {
        const response = await fetch(API_URL + "/api/automaticresponse/state");
        if (!response.ok) throw new Error("Failed to fetch automatic response state");
        const data = await response.json();
        this.isAutomaticResponseActive = data.value;
      } catch (error) {
        console.error(error.message);
      }
    },
    async toggleAutomaticResponse() {
      const newState = !this.isAutomaticResponseActive;
      try {
        const response = await fetch(API_URL+ "/api/automaticresponse/toggle", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({value: newState}),
        });
        if (!response.ok) throw new Error("Failed to toggle automatic response");
        this.isAutomaticResponseActive = newState;
      } catch (error) {
        console.error(error.message);
      }
    },
    async fetchEmails() {
      try {
        const response = await fetch(API_URL + "/api/email/emails");
        if (!response.ok) throw new Error("Failed to fetch emails");
        const data = await response.json();
        this.emails = data.data;
      } catch (error) {
        console.error(error.message);
      }
    },
    async generateReply(emailId) {
      this.isLoading[emailId] = true; // Aktiviert das Loading-Symbol
      try {
        const response = await fetch(API_URL +"/api/email/manual-reply", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({emailId}),
        });
        if (!response.ok) throw new Error("Failed to generate reply");

        const data = await response.json();
        this.popupReply = data.replyBody;
        this.selectedEmailId = emailId;
        this.showPopup = true;
      } catch (error) {
        console.error("Error generating reply:", error.message);
      } finally {
        this.isLoading[emailId] = false; // Deaktiviert das Loading-Symbol
      }
    },

    closePopup() {
      this.showPopup = false;
      this.selectedEmailId = null;
      this.popupReply = "";
    },
    async sendReply(replyBody) {
      try {
        const response = await fetch(API_URL + "/api/email/send-reply", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            emailId: this.selectedEmailId,
            replyBody,
          }),
        });
        if (!response.ok) throw new Error("Failed to send reply");
        this.fetchEmails();
        this.closePopup();
      } catch (error) {
        console.error(error.message);
      }
    },
  },
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>
