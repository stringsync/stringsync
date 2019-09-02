import Vue from 'vue';
import Router from 'vue-router';
import ssLibrary from './views/ss-library.vue';

const ssAbout = () =>
  import(/* webpackChunkName: "ssAbout" */ './views/ss-about.vue');
const ssLogin = () =>
  import(/* webpackChunkName: "ssLogin" */ './views/ss-login.vue');
const ssSignup = () =>
  import(/* webpackChunkName: "ssSignup" */ './views/ss-signup.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'library',
      component: ssLibrary,
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
    {
      path: '/signup',
      name: 'signup',
      component: ssSignup,
    },
  ],
});

export default router;
