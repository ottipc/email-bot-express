import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        message: '',
    },
    mutations: {
        setMessage(state, message) {
            state.message = message;
        },
    },
    actions: {
        updateMessage({ commit }, message) {
            commit('setMessage', message);
        },
    },
    getters: {
        message: (state) => state.message,
    },
});
