<template>
  <div class="email-list">
    <h1>Email List</h1>

    <!-- Listener Toggle -->
    <button @click="toggleListener">
      {{ isListenerActive ? "Disable Listener" : "Enable Listener" }}
    </button>

    <hr />

    <!-- List of Emails -->
    <div v-for="email in emails" :key="email._id" class="email-item">
      <h3>{{ email.subject }}</h3>
      <p><strong>From:</strong> {{ email.sender }}</p>
      <p><strong>Body:</strong> {{ email.body }}</p>

      <!-- Antwort anzeigen, falls vorhanden -->
      <div v-if="email.replyBody">
        <h4>Reply:</h4>
        <p>{{ email.replyBody }}</p>
      </div>

      <!-- Button, falls keine Antwort vorhanden ist -->
      <button v-if="!email.replyBody" @click="generateReply(email._id)">
        Generate Reply
      </button>

      <!-- Delete Button -->
      <button @click="deleteEmail(email._id)">Delete</button>
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
</template>

<script>
import ReplyPopup from "./ReplyPopup.vue";

export default {
  name: "EmailList",
  components: {
    ReplyPopup,
  },
  data() {
    return {
      emails: [], // List of emails from the server
      isListenerActive: true, // State of the Listener
      showPopup: false, // State of the Reply Popup
      selectedEmailId: null, // ID of the Email being replied to
      popupReply: "", // Reply text shown in the popup
    };
  },
  mounted() {
    console.log("****** mounted *******")
    this.fetchEmails(); // Initialer Abruf der E-Mails
    this.getListenerState(); // Abruf des Listener-Zustands
  },

  methods: {
    // Delete E-Mail and Reply
    async deleteEmail(emailId) {
      try {
        const response = await fetch(`http://localhost:3000/api/email/${emailId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete email");
        }

        console.log("Email deleted successfully.");
        this.fetchEmails(); // Aktualisiere die Liste der E-Mails
      } catch (error) {
        console.error("Error deleting email:", error.message);
      }
    },

    async getListenerState() {
      console.log("GET listener state (EmailList.vue)");
      try {
        console.log("Scheisse in  (EmailList.vue)");
        const response = await fetch("http://localhost:3000/api/listener/state");
        console.log("response of listener (EmailList.vue) : " + JSON.stringify(response));

        if (!response.ok) {
          throw new Error("Failed to fetch listener state (EmailList.vue)");
        }
        const data = await response.json();
        console.log("Listener State fetched (EmailList.vue):", data.value);
        this.isListenerActive = data.value; // Synchronisiere den Zustand
      } catch (error) {
        console.error("Error fetching listener state (EmailList.vue):", error.message);
      }
    },

    async toggleListener() {
      try {
        const newState = !this.isListenerActive;
        console.log("Toggle Listener to (EmailList.vue) : " + newState)
        const response = await fetch("http://localhost:3000/api/listener/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value: newState }),
        });

        if (!response.ok) {
          throw new Error("Failed to toggle listener");
        }

        this.isListenerActive = newState; // Lokaler Zustand aktualisieren
        console.log(`Listener ${newState ? "enabled" : "disabled"} successfully.`);
      } catch (error) {
        console.error("Error toggling listener:", error.message);
      }
    },

    // Fetch Emails from the Server
    async fetchEmails() {
      try {
        const response = await fetch("http://localhost:3000/api/email/emails");
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }
        const data = await response.json();
        this.emails = data.data; // E-Mails in der Liste speichern
      } catch (error) {
        console.error("Error fetching emails:", error.message);
      }
    },

    // Generate a Reply for a Specific Email
    async generateReply(emailId) {
      try {
        const response = await fetch("http://localhost:3000/api/email/manual-reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailId }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate reply");
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (!data.replyBody) {
          console.error("Reply body is undefined.");
          alert("Could not generate a reply. Please try again.");
          return;
        }

        // Setze popupReply und öffne das Popup erst danach
        this.popupReply = data.replyBody; // Antwort setzen
        this.selectedEmailId = emailId;  // E-Mail-ID setzen
        this.showPopup = true;           // Popup öffnen
      } catch (error) {
        console.error("Error generating reply:", error.message);
        alert("An error occurred while generating the reply. Please try again.");
        this.popupReply = ""; // Fallback, um leeres Popup zu vermeiden
      }
    },


    // Close the Popup
    closePopup() {
      this.showPopup = false;
      this.selectedEmailId = null;
      this.popupReply = "";
    },

    // Send the Generated Reply
    async sendReply(replyBody) {
      try {
        const response = await fetch("http://localhost:3000/api/email/send-reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailId: this.selectedEmailId,
            replyBody,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send reply");
        }

        console.log("Reply sent successfully.");
        alert("Reply sent successfully.")
        this.fetchEmails(); // Refresh Email List
        this.closePopup(); // Close the Popup
      } catch (error) {
        console.error("Error sending reply:", error.message);
      }
    },
  },

};
</script>

<style scoped>
.email-list {
  padding: 20px;
}

.email-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  margin: 10px 0;
  padding: 8px 12px;
  cursor: pointer;
}

.reply-popup {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  width: 400px;
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 1000;
}
</style>
