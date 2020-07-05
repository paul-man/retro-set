<template>
  <div id="app">
    <navbar v-if="$route.name === 'search'"/>
    <div class="app-wrap">
      <router-view />
    </div>
    <footer> <small>Copyright &copy; {{currentYear}}, RetroSet. All Rights Reserved</small> </footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  name: "App",
  components: {
    Navbar
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },

  methods: {
  }
};
</script>

<style lang="scss">
@import "@/scss/settings.scss";
@import "@/scss/base.scss";

html, body {
  margin: 0;
  min-height: 100vh;
  background-color: $retro-green !important;
  background-size: cover;
}

#app {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 3%,
    rgba(11, 217, 141, 1) 45%
  );

  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.inline-heading {
  display: inline-block;
  padding-right: 1em;
}

.app-wrap {
  padding: 10px;
}

.tracklistPanel {
  width: 55% !important;
  z-index: 1021 !important;
}

.img-lg {
  
  height: 175px;
  width: 175px;
}

.img-md {
  height: 64px;
  width: 64px;
  border: 1px solid gray;
}

.img-sm {
  height: 30px;
  width: 30px;
}

.bold {
  font-weight: bold;
}


.search-icon {
  height: 25px;
  width: 25px;
  
}

.icon-svg {
  margin-bottom: 0.5em;
}

footer {
  padding-bottom: 10px;
  bottom: 0%;
  width: 100%;
}

.action-word {
  text-decoration: underline;
  color: $primary-shade;
}

a.action {
  // color: $retro-green !important;
  text-decoration: underline !important;
}
</style>
