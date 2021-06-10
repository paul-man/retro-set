import Vue, { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import store from "./store"
import "./filters"
import "./mixins"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap'
import VueSlideoutPanel from 'vue2-slideout-panel'

// TODO: Conditionally import these if (process.env.NODE_ENV.trim() === 'production')
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
// 
if (process.env.NODE_ENV.trim() === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    integrations: [new VueIntegration({Vue, attachProps: true})],
  });
}
// 

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Registering globally for usage with VueSlideoutPanel
import SongSelect from '@/components/songSelect/SongSelect'
Vue.component('song-select', SongSelect);

Vue.use(VueSlideoutPanel);

Vue.component('vue-typeahead-bootstrap', VueTypeaheadBootstrap)

createApp(App).use(store).use(router).use(router).use(store).mount('#app')