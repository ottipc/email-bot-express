<template>
  <div>
    <h2>Gespeicherte E-Mails</h2>
    <div v-if="loading">Lade E-Mails...</div>
    <ul v-else>
      <li v-for="email in emails" :key="email._id">
        <p>ID: {{ email._id }}</p>
        <h3>Subject: {{ email.subject }}</h3>
        <p><strong>Von:</strong> {{ email.sender }}</p>
        <p><strong>Inhalt:</strong> {{ email.body }}</p>
        <p><strong>Antwort:</strong> {{ email.replyBody }}</p>
        <button @click="deleteEmail(email._id)">Löschen</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emails: [],
      loading: true,
    };
  },
  async created() {
    await this.fetchEmails();
  },
  methods: {
    async fetchEmails() {
      try {
        const response = await fetch("http://localhost:3000/api/emails");
        if (!response.ok) throw new Error("Fehler beim Abrufen der E-Mails");
        const data = await response.json();
        this.emails = data.data;
        this.loading = false;
      } catch (error) {
        console.error(error);
        alert("Fehler beim Laden der E-Mails");
      }
    },
    async deleteEmail(emailId) {
      try {
        const response = await fetch(`http://localhost:3000/api/email/${emailId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Fehler beim Löschen der E-Mail");
        alert("E-Mail erfolgreich gelöscht");
        await this.fetchEmails();
      } catch (error) {
        console.error(error);
        alert("Fehler beim Löschen der E-Mail");
      }
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  border: 1px solid #ddd;
  padding: 1em;
  margin: 1em 0;
  border-radius: 5px;
  background: #f9f9f9;
}

button {
  padding: 0.5em 1em;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 3px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
