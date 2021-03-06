import Vue from "vue";
import Router from "vue-router";
import store from "./store.js";
import Search from "./views/Search.vue";
import PageNotFound from "./views/errors/PageNotFound.vue";
import SpotifyLogin from "./views/SpotifyLogin.vue";
import About from "./views/About.vue";
import SpotifyError from "./views/errors/SpotifyError.vue";
import SetlistfmError from "./views/errors/SetlistfmError.vue";

Vue.use(Router);

const ifUserLoaded = (to, from, next) => {
  if (to.query.user) {
    store.commit("setUser", JSON.parse(to.query.user));
  }
  if (store.getters.isUserLoaded) {
    next();
    return;
  }
  next("/spotify-login");
};

async function ifUserNotLoaded(to, from, next) {
  if (!store.getters.isUserLoaded) {
    next();
    return;
  }
  next("/");
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
      path: "/about",
      name: "about",
      component: About,
      beforeEnter: ifUserNotLoaded,
    },
    {
      path: "/spotify-error",
      name: "spotify-error",
      component: SpotifyError,
    },
    {
      path: "/setlistfm-error",
      name: "setlistfm-error",
      component: SetlistfmError,
      beforeEnter: ifUserNotLoaded,
    },
    {
      path: "*",
      component: PageNotFound,
    },
  ],
});

// async function loadUser(){
//   if (store.getters.isUserLoaded) {
//     return
//   }
//   let res = await get("api/spotify/user");
//   if (res.data) {
//     store.commit("setUser", res.data);
//   } else {
//     store.commit("setUser", {});
//   }
// }

export default router;
