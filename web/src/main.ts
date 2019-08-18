import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from 'axios';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

const env = process.env.NODE_ENV;
const baseURL = process.env.VUE_APP_API_BASE_URL;

// configure
Vue.config.silent = env === 'production';
Vue.config.performance = env === 'development';
Vue.config.productionTip = false;
axios.defaults.baseURL = baseURL;

// init
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
