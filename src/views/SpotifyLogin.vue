<template>
  <div id="spotify-login">
    <div class="container">
      <img
        src="@/assets/icon.png"
        id="retroset-icon"
        height="150"
        width="150"
      />
    </div>
    <div class="container">
      <h1>RETROSET</h1>
      <p>Search Setlist.fm data for a concert date and turn it into a playlist!</p>
    </div>
    <div class="container">
      <b-button
        @click="loginSpotify"
        id="spotify-login-btn"
        title="Login to Spotify"
      >
        <span class="bold">LOG IN WITH SPOTIFY</span
        ><i class="fa fa-spotify"></i>
      </b-button>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import { get } from "axios";

export default {
  name: "spotify-login",
  props: [],
  data() {
    return {};
  },

  computed: {},

  async mounted() {},

  methods: {
    async loginSpotify() {
      let res = await get("api/spotify/login/");
      window.location = res.data;
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
#spotify-login {
  text-align: center;
  padding-top: 50px;
}
#spotify-login .container {
  padding: 1em;
}

button span {
  margin-right: 0.5em;
}

#retroset-icon {
  display: inline;
}

#spotify-login button {
  margin-top: 2em;
}

.fa-spotify {
  font-size: 22px;
}

#spotify-login-btn {
  font-size: 20px;
  border: none;
  color: black;
  background-color: #16b5d9;
  vertical-align: middle;
  display: table-cell;
}
</style>
