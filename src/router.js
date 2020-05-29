import Vue from 'vue'
import Router from 'vue-router'
import Search from './views/Search.vue'
import PageNotFound from './views/PageNotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/search',
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    { 
      path: "*", 
      component: PageNotFound 
    }
  ]
})
