// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue"; // Dashboard-Komponente
import EmailList from "@/components/EmailList.vue"; // Email-Liste
import PromptEditor from "@/components/PromptEditor.vue"; // Prompt-Editor
const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView, // Dashboard wird angezeigt
    },
    {
        path: "/emails",
        name: "EmailList",
        component: EmailList, // Email-Liste
    },
    {
        path: "/edit-prompt",
        name: "EditPrompt",
        component: PromptEditor, // Prompt-Editor
    },
];

const router = createRouter({
    history: createWebHistory(), // Aktiviert den History-Modus
    routes,
});

export default router;
