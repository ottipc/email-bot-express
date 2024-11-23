import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './views/DashboardView.vue';
import EmailDetails from './views/EmailDetails.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Dashboard },
    { path: '/email/:id', component: EmailDetails }
];

export default new VueRouter({
    mode: 'history',
    routes
});
