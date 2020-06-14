<template>
  <div id="spotify-login constainer">
    <button type="button" class="btn" id="spotify-login-btn" title="Login to Spotify" @click="loginSpotify">
      <div class="text-center">
        <span class="float-left bold">Please login to Spotify</span>
        <img src="@/assets/spotify_icon.png" class="icon-img float-right"/>
      </div>
    </button>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "spotify-login",
  props: [],
  data() {
    return {
      
    };
  },

  computed: {
    
  },

  async mounted() {
    
  },

  methods: {
    async loginSpotify() {
      let res = await axios.get("api/spotify/login/");
      window.location = res.data
    }
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.icon-img {
  height: 40px;
  width: 40px;
  vertical-align: middle;
}

#spotify-login-btn {
  background-color: white;
}
</style>
