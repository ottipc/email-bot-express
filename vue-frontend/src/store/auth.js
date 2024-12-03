import { login } from '@/api/auth';

const auth = {
    state: {
        token: localStorage.getItem('token') || null, // JWT-Token
        user: null, // Benutzerinformationen (falls benötigt)
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        CLEAR_TOKEN(state) {
            state.token = null;
            localStorage.removeItem('token');
        },
        SET_USER(state, user) {
            state.user = user;
        },
    },
    actions: {
        async login({ commit }, { username, password }) {
            const data = await login(username, password);
            commit('SET_TOKEN', data.token); // JWT speichern
        },
        logout({ commit }) {
            commit('CLEAR_TOKEN');
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
};

export default auth;
