<template>
  <div id="app">
    <h1>Pit People</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss">
  @import '@/scss/base.scss';
  @import '@/scss/settings.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.tracklistPanel {
  width: 85% !important;
}

.bold {
  font-weight: bold;
}
</style>
