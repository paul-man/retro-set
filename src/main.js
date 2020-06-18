import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import "./filters"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import VueSlideoutPanel from 'vue2-slideout-panel'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

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