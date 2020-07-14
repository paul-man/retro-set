<template>
  <div
    id="setlist-container-comp"
    class="container">
    <div class="row">
      <div
        class="col-sm-12 col-md-12 col-lg-6 setlist-container"
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
 /* Add border between mutliple setlists */
.setlist-container {
  border: solid 1px rgba(211, 211, 211, 0.459);
  border-radius: 2px;
  padding-bottom: 15px;
}
</style>