<template>
  <div class="reply-popup">
    <h2>Generated Reply</h2>
    <!-- Textarea zur Anzeige und Bearbeitung der generierten Antwort -->
    <textarea v-model="replyBody" rows="10" cols="50"></textarea>
    <div class="buttons">
      <!-- Buttons für neue Antwortgenerierung, Senden und Schließen -->
      <button @click="generateNewReply">Generate New Reply</button>
      <button @click="send">Send</button>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReplyPopup",
  props: {
    // ID der E-Mail, für die eine Antwort generiert wird
    emailId: {
      type: String,
      required: true,
    },
    // Initial generierte Antwort, die im Popup angezeigt wird
    initialReply: {
      type: String,
      required: true,
      default: "", // Standardwert für leere Antworten
    },
  },
  data() {
    return {
      replyBody: this.initialReply, // Antwort aus den Props initialisieren
    };
  },
  methods: {
    /**
     * Generiert eine neue Antwort für dieselbe E-Mail
     */
    async generateNewReply() {
      try {
        const response = await fetch("http://localhost:3000/api/email/manual-reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({emailId: this.emailId}),
        });

        if (!response.ok) {
          throw new Error("Failed to generate a new reply");
        }

        const data = await response.json();
        console.log("New reply generated successfully:", data);

        // Aktualisiere die Antwort im Textfeld
        this.replyBody = data.replyBody;
      } catch (error) {
        console.error("Error generating a new reply:", error.message);
      }
    },

    /**
     * Sendet die generierte Antwort
     */
    async send() {
      try {
        // Emitiere ein Event, damit die Elternkomponente die Antwort sendet
        this.$emit("send", this.replyBody);
      } catch (error) {
        console.error("Error sending reply:", error.message);
      }
    },
    created() {
      console.log("Initial Reply in Popup:", this.initialReply); // Sollte den generierten Text anzeigen
    },
    /**
     * Schließt das Popup
     */
    close() {
      // Emitiere ein Event, um das Popup zu schließen
      this.$emit("close");
    },
  },
};



</script>

<style scoped>
.reply-popup {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  width: 800px;
  height: 800px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

textarea {
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}

button:last-child {
  background-color: #6c757d;
}

button:last-child:hover {
  background-color: #5a6268;
}
</style>
