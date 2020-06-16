<template>
  <div id="app">
    <h1>RetroSet</h1>
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
html, body {
  margin: 0;
  min-height:100vh;
  background-color: #00e286;
  background-size: cover;
}

#app {
  background: linear-gradient(180deg, rgba(255,255,255,1) 3%, rgba(0,226,134,1) 45%); 
  
  font-family: 'Roboto', sans-serif;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  padding: 10px;
}

.tracklistPanel {
  width: 65% !important;
}

.bold {
  font-weight: bold;
}

.text-w-svg h2 {
  display: inline;
}

.text-w-svg img {
  display: inline;
  margin-top: -5px;
  margin-left: 5px;
}

.icon-svg, .icon-img {
  height: 20px;
  width: 20px;
  margin-left: 0.5em !important;
}

.icon-svg {
  margin-bottom: 0.5em;
}
</style>
