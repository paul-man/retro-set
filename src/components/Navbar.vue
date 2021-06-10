<template>
  <b-navbar toggleable="sm" type="light" variant="light" sticky>
    <b-navbar-brand>
      <img src="@/assets/icon.png" class="img-sm retroset-icon" />
      RetroSet
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon
          v-if="expanded"
          variant="primary"
          icon="dash-square"
          font-scale="1.5"
        ></b-icon>
        <b-icon
          v-else
          variant="primary"
          icon="plus-square"
          font-scale="1.5"
        ></b-icon>
      </template>
    </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <img
              :src="getUserImg(user.imgUrl)"
              class="d-inline-block align-top spotify-user-img"
              alt="Spotify user image"
            />
            <p class="nav-user-id" :title="user.id">{{ user.id }}</p>
          </template>
          <b-dropdown-item
            :href="'https://open.spotify.com/user/' + user.id"
            target="_blank"
          >
            Spotify Profile
          </b-dropdown-item>
          <b-dropdown-item @click="logout" title="Switch spotify account">
            Not you?
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item href="https://buymeacoff.ee/paulman" target="_blank">
            Buy me a coffee
            <p class="emoji">&#x1F389;</p>
          </b-dropdown-item>
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
  mounted() {},
  components: {},

  computed: {
    ...mapState(["user"]),
  },

  methods: {
    async logout() {
      this.$store.commit("setUser", {});
      get("api/spotify/login/", { params: { newUser: true } })
        .then((result) => {
          window.location = result.data;
        })
        .catch((error) => {
          this.makeErrorToast(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  padding: 0;
  border-bottom: lightgray solid 1px;
}

.nav-user-id {
  display: inline-block;
  margin-bottom: 0;
  margin-top: 1.25em;
}
@media only screen and (max-width: 576px) {
  .nav-user-id {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
    text-align: left;
  }

  #nav-collapse li {
    text-align: left;
  }
}

.navbar-toggler {
  border: none !important;
}

#nav-collapse.show {
  border-top: 1px solid rgba(211, 211, 211, 0.562);
}

.navbar-brand {
  font-size: 2em;
}

.emoji {
  display: inline-block;
}
</style>
