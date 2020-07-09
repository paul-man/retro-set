import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import "./filters"
import "./mixins"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import VueSlideoutPanel from 'vue2-slideout-panel'

// TODO: Conditionally import these if (process.env.NODE_ENV.trim() === 'production')
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
// 
if (process.env.NODE_ENV.trim() === 'production') {
  Sentry.init({
    dsn: 'https://3f6a94636953494c9d12ab520e693cbc@o409962.ingest.sentry.io/5283409',
    integrations: [new VueIntegration({Vue, attachProps: true})],
  });
}
// 

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Registering globally for usage with VueSlideoutPanel
import TrackSelect from '@/components/TrackSelect/TrackSelect'
Vue.component('track-select', TrackSelect);

Vue.use(VueSlideoutPanel);
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')