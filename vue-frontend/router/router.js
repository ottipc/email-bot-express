// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import EmailForm from "@/components/EmailForm.vue";
import EmailList from "@/components/EmailList.vue";

const routes = [
    { path: "/", name: "GenerateEmail", component: EmailForm },
    { path: "/emails", name: "EmailList", component: EmailList },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
