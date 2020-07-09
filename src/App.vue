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
@import "@/scss/app.scss";
</style>
