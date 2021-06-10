<template>
  <div id="spotify-login">
    <div class="container">
      <img src="@/assets/icon.png" class="img-lg retroset-icon" />
    </div>
    <div class="container">
      <h1>RETROSET</h1>
      <p>Take a concert and turn it into a Spotiy playlist!</p>
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

<script lang="ts">
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
      if (res.error) {
        this.makeErrorToast("Unable to login to Spotify");
      }
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

#spotify-login button {
  margin-top: 2em;
}

.fa-spotify {
  font-size: 22px;
}

#spotify-login-btn {
  font-size: 20px;
  border: 1px solid gray;
  color: black;
  background-color: #16b5d9;
  vertical-align: middle;
  display: table-cell;
  transition: all 0.3s ease-in;
}
#spotify-login-btn:hover {
  transform: scale(0.97);
}
</style>
