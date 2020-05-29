import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import "./filters"
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')