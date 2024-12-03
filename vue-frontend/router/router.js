// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue"; // Dashboard-Komponente
import RegisterView from "@/views/RegisterView.vue"; // Dashboard-Komponente
import EmailList from "@/components/EmailList.vue"; // Email-Liste
import PromptEditor from "@/components/PromptEditor.vue"; // Prompt-Editor
import store from "@/store";
const routes = [
    { path: '/',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false }, // Login-Seite ist öffentlich
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterView,
        meta: { requiresAuth: false },
    },
    {
        path: "/emails",
        name: "EmailList",
        component: EmailList, // Email-Liste
        meta: {requiresAuth: true},
    },
    {
        path: "/edit-prompt",
        name: "EditPrompt",
        component: PromptEditor, // Prompt-Editor
        meta: { requiresAuth: true}
        },
];

const router = createRouter({
    history: createWebHistory(), // Aktiviert den History-Modus
    routes,
});

// Schutz für geschützte Routen
// Router-Guard für geschützte Routen
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated; // Überprüft Authentifizierung
    console.log(store.getters)
    if (to.meta.requiresAuth && !isAuthenticated) {
        // Benutzer ist nicht eingeloggt, leite auf Login um
        next("/");
    } else if (to.name === "Login" && isAuthenticated) {
        // Benutzer ist eingeloggt, leite auf Home um
        next("/emails");
    } else {
        // Zugriff erlauben
        next();
    }
});


export default router;
