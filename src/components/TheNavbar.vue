<template>
  <div id="nav">
    <nav class="navbar navbar-default fixed-top justify-content-center">
      <div class="container">
        <router-link class="active" to="/search">Setlist Search</router-link>
      </div>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'TheNavbar',
  components: {
  }
}
</script>

<style  lang="scss" scoped>
  $navlink-color: rgb(0, 0, 0);  
  $nav-bg-color: rgb(144, 203, 255);

  .navbar {
    background-color: rgb(144, 203, 255);
    position: relative;
  }
  
  #nav a {
    color: $navlink-color;
    text-decoration: none;
  }

  #nav a:hover {
    color: $navlink-color;
    border: 5px black;
  }
</style>