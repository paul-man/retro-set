import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import "./filters"
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import VueSlideoutPanel from 'vue2-slideout-panel'

// Registering globally for usage with VueSlideoutPanel
import TrackSelect from '@/components/TrackSelect'
Vue.component('track-select', TrackSelect);

Vue.use(VueSlideoutPanel);
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')