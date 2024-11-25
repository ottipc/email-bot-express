<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div
        class="bg-white dark:bg-gray-800 shadow-xl rounded-lg w-3/4 max-w-4xl p-8 relative transform transition-all scale-95"
    >
      <button
          @click="close"
          class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
      >
        X
      </button>
      <h2 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-300">
        Generated Reply
      </h2>
      <textarea
          v-model="replyBody"
          rows="10"
          class="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <div class="flex justify-end gap-4 mt-6">
        <button
            @click="generateNewReply"
            class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Generate New Reply
        </button>
        <button
            @click="send"
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Send Reply
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReplyPopup",
  props: {
    emailId: { type: String, required: true },
    initialReply: { type: String, required: true },
  },
  data() {
    return {
      replyBody: this.initialReply,
    };
  },
  methods: {
    async generateNewReply() {
      try {
        const response = await fetch("/api/email/manual-reply", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({emailId: this.emailId}),
        });
        if (!response.ok) throw new Error("Failed to generate a new reply");
        const data = await response.json();
        this.replyBody = data.replyBody;
      } catch (error) {
        console.error("Error generating a new reply:", error.message);
      }
    },
    send() {
      this.$emit("send", this.replyBody);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
