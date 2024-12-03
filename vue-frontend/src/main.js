// src/main.js
import { createApp } from "vue";
import App from "@/App.vue";
import router from "../router/router";
import '../css/index.css';
import store from "./store/index";

const app = createApp(App);
app.use(store); // Vuex-Store verwenden
app.use(router); // Router verwenden
app.mount("#app");
