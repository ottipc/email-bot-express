<template>
  <div class="email-form">
    <h2>E-Mail-Antwort generieren</h2>

    <!-- E-Mail Eingabeformular -->
    <form @submit.prevent="generateReply">
      <div class="form-group">
        <label for="subject">Betreff</label>
        <input type="text" id="subject" v-model="emailData.subject" required />
      </div>

      <div class="form-group">
        <label for="body">E-Mail-Inhalt</label>
        <textarea id="body" v-model="emailData.body" required></textarea>
      </div>

      <div class="form-group">
        <label for="sender">Absender</label>
        <input type="email" id="sender" v-model="emailData.sender" required />
      </div>

      <button type="submit">Antwort generieren</button>
    </form>

    <!-- Antwortbereich -->
    <div v-if="generatedReply" class="response">
      <h3>Generierte Antwort:</h3>
      <p><strong>Betreff:</strong> {{ generatedReply.reply_subject }}</p>
      <p><strong>Antwort:</strong> {{ generatedReply.reply_body }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailData: {
        subject: '',
        body: '',
        sender: '',
      },
      generatedReply: null,
    };
  },
  methods: {
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
        console.log("API Response:", data); // Debugging: API-Antwort überprüfen

        // Setze die Antwort und öffne das Popup
        this.popupReply = data.replyBody || ""; // Fallback auf einen leeren String
        this.selectedEmailId = emailId;
        this.showPopup = true; // Popup erst jetzt öffnen
      } catch (error) {
        console.error("Error generating reply:", error.message);
        this.popupReply = ""; // Setze einen leeren String, um den Fehler zu vermeiden
      }
    }
  },
};
</script>

<style scoped>
.email-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.response {
  margin-top: 20px;
  border-top: 2px solid #ccc;
  padding-top: 10px;
}
</style>
