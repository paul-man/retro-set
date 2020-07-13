import Vue from "vue";
// import BVToastPlugin from 'bootstrap-vue';

Vue.mixin({
  methods: {
    makeErrorToast: function(msg, title="Uh oh!", type="danger") {
      this.$bvToast.toast(msg, {
        title: title,
        variant: type,
        solid: true,
      });
    },
    makeWarningToast: function(msg, title="Notice", type="warning") {
      this.$bvToast.toast(msg, {
        title: title,
        variant: type,
        solid: true,
      });
    },
    getAlbumImg: function (imgSrc) {
      if (imgSrc !== '') {
        return imgSrc
      }
      return require('@/assets/no-album-art.png');
    },
    getUserImg: function (imgSrc) {
      if (imgSrc !== '') {
        return imgSrc
      }
      return require('@/assets/no-user-img.png');
    },
    isDev() {
      return process.env.NODE_ENV.trim() === "development";
    },
  }
})