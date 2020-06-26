<template>
  <!-- <div id="nav"> -->
  <b-navbar toggleable="lg" type="light" variant="light" sticky>
    <b-navbar-brand>
      <img src="@/assets/icon.png" id="retroset-icon" height="30" width="30" />
      RetroSet
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon v-if="expanded" variant="primary" icon="dash-square" font-scale="1.5"></b-icon>
        <b-icon v-else variant="primary" icon="plus-square" font-scale="1.5"></b-icon>
      </template>
    </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <img
              :src="user.imgUrl"
              class="d-inline-block align-top"
              id="spotify-user-img"
              alt="Spotify user image"
            />{{ user.id }}
          </template>
          <b-dropdown-item
            :href="'https://open.spotify.com/user/' + user.id"
            target="_blank"
            >Spotify Profile</b-dropdown-item
          >
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout" title="Switch spotify account"
            >Not you?</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";
import { get } from "axios";
export default {
  name: "Navbar",
  data() {
    return {};
  },

  mounted() {
  },

  components: {},

  computed: {
    ...mapState(["user"]),
    isDev() {
      return process.env.NODE_ENV.trim() === "development";
    },
  },
  methods: {
    async logout() {
      this.$store.commit("setUser", {});
      let res = await get("api/spotify/login/", { params: { newUser: true } });
      window.location = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  padding: 0;
  border-bottom: lightgray solid 1px;
}

.navbar-toggler {
  border: none !important;
}

#nav-collapse.show {
  border-top: 1px solid rgba(211, 211, 211, 0.562);
}

.navbar-nav.ml-auto {
  width: 10em !important;
}

#retroset-icon {
  display: inline;
}

.navbar-brand {
  font-size: 2em;
}
</style>
