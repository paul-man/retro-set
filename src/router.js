import Vue from 'vue'
import Router from 'vue-router'
import Search from './views/Search.vue'
import PageNotFound from './views/PageNotFound.vue'
import SpotifyLogin from './views/SpotifyLogin.vue'
import store from './store.js'

Vue.use(Router)

const ifUserLoaded = (to, from, next) => {
  if (to.query.user) {
    store.commit("setUserID", JSON.parse(to.query.user));
  }
  if (store.getters.isUserLoaded) {
    next()
    return
  }
  next('/spotify-login')
}

const ifUserNotLoaded = (to, from, next) => {
  if (!store.getters.isUserLoaded) {
    next()
    return
  }
  next('/')
}

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "search",
      component: Search,
      beforeEnter: ifUserLoaded,
    },
    {
      path: "/spotify-login",
      name: "spotify-login",
      component: SpotifyLogin,
      beforeEnter: ifUserNotLoaded,
    },
    {
      path: "/404",
      component: PageNotFound,
    },
  ],
});

export default router;
