<template>
  <div class="spotify-error">
    <b-container>
      <img
        src="@/assets/icon.png"
        id="retroset-icon"
        height="150"
        width="150"
      />
    </b-container>
    <b-container class="error-msg-container">
      <h1>Whoops! Looks like something went wrong!</h1>
      <h2 class="error-msg">{{statusMessage}}</h2>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "spotify-error",
  components: {
  },

  mounted() {
    this.status = this.$route.query.status;
    if (this.status) this.statusMessage = this.respCodes[this.status];
    let query = Object.assign({}, this.$route.query);
    delete query.status;
    this.$router.replace({ query });
  },

  data() {
    return {
      status: '',
      statusMessage: ''
    };
  },

  computed: {
    ...mapState(['respCodes'])
  },

  methods: {
  },

  watch: {
  }
};
</script>

<style lang="scss" scoped>
#retroset-icon {
  display: inline;
}

.error-msg-container {
  padding: 2em;
}

.error-msg {
  text-decoration: underline;
  padding: 1em
}
</style>
