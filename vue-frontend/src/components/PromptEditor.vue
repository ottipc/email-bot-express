<template>
  <div class="prompt-editor">
    <h1 class="text-2xl font-bold mb-4">Edit GPT Prompt and Signature</h1>

    <!-- Prompt-Eingabefeld -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Prompt</h2>
      <textarea
          v-model="prompt"
          rows="10"
          class="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <!-- Signatur-Eingabefeld -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Email Signature</h2>
      <textarea
          v-model="signature"
          rows="5"
          class="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <!-- Buttons -->
    <div class="mt-4 flex gap-4">
      <button
          @click="savePromptAndSignature"
          class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
      >
        Save
      </button>
      <button
          @click="loadPromptAndSignature"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
      >
        Reset to Current
      </button>
    </div>

    <!-- Erfolgs- oder Fehlermeldungen -->
    <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </div>
</template>

<script>
import { API_BASE_URL } from "@/api"; // Basis-URL importieren

export default {
  data() {
    return {
      prompt: "", // Prompt-Text
      signature: "", // Signatur-Text
      message: "", // Erfolgsnachricht
      error: "", // Fehlermeldung
    };
  },
  methods: {
    // Prompt und Signatur laden
    async loadPromptAndSignature() {
      console.log("In loadPromptAndSignature (PromptEditor.vue)...");
      try {
        const response = await fetch(`${API_BASE_URL}/api/prompt`);
        if (!response.ok) {
          throw new Error("Failed to load the prompt and signature.");
        }
        const data = await response.json();
        this.prompt = data.prompt || ""; // Lade Prompt
        this.signature = data.signature || ""; // Lade Signatur
        this.message = "Prompt and signature loaded successfully.";
        this.error = "";
      } catch (error) {
        this.error = "Failed to load the prompt and signature.";
        console.error("Error loading prompt and signature (PromptEditor.vue):", error);
      }
    },
    // Prompt und Signatur speichern
    async savePromptAndSignature() {
      console.log("In savePromptAndSignature (PromptEditor.vue)...");
      try {
        const response = await fetch(`${API_BASE_URL}/api/prompt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: this.prompt, // Speichere Prompt
            signature: this.signature, // Speichere Signatur
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to save the prompt and signature.");
        }
        this.message = "Prompt and signature saved successfully!";
        this.error = "";
        setTimeout(() => (this.message = ""), 3000); // Erfolgsnachricht ausblenden
      } catch (error) {
        this.error = "Failed to save the prompt and signature.";
        this.message = "";
        console.error("Error saving prompt and signature (PromptEditor.vue):", error);
      }
    },
  },
  mounted() {
    this.loadPromptAndSignature(); // Lade Prompt und Signatur beim Laden der Komponente
  },
};
</script>

<style scoped>
.prompt-editor {
  max-width: 800px;
  margin: 0 auto;
}
textarea {
  resize: none;
}
button {
  transition: all 0.2s ease-in-out;
}
</style>
