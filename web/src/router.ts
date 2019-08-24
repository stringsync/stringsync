import Vue from 'vue';
import Router from 'vue-router';
import ssHome from './views/ss-home.vue';

const ssAbout = () =>
  import(/* webpackChunkName: "about" */ './views/ss-about.vue');
const ssLogin = () =>
  import(/* webpackChunkName: "about" */ './views/ss-login.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: ssHome,
    },
    {
      path: '/about',
      name: 'about',
      component: ssAbout,
    },
    {
      path: '/login',
      name: 'login',
      component: ssLogin,
    },
  ],
});
