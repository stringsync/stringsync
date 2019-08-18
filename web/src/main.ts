import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from 'axios';

// configure
Vue.config.productionTip = process.env.NODE_ENV === 'production';
axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

// instantiate the root Vue component
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
