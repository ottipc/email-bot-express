import { createStore } from "vuex";

const store = createStore({
    state: {
        token: localStorage.getItem("token") || null, // Speichert den JWT-Token
    },
    getters: {
        isAuthenticated: (state) => !!state.token, // Überprüft, ob der Benutzer eingeloggt ist
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem("token", token);
        },
        CLEAR_TOKEN(state) {
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    actions: {
        login({ commit }, token) {
            commit("SET_TOKEN", token);
        },
        logout({ commit }) {
            commit("CLEAR_TOKEN");
        },
    },
});

export default store;
