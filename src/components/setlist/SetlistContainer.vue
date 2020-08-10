<template>
  <div
    id="setlist-container-comp"
    class="container">
    <div class="row">
      <div
        v-for="(set, index) in setlists" :key="index">
        <setlist
          :setIndex="index"/>
      </div>
    </div>
    
    <!-- Slideout panel for playlist creation -->
    <slideout-panel/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Setlist from "@/components/setlist/Setlist"

export default {
  name: "SetlistContainer",

  components: {
    Setlist,
  },

  data() {
    return {
      templates: [],
    };
  },

  computed: {
    ...mapState(["setlists"]),
  },

  methods: {
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
</style>