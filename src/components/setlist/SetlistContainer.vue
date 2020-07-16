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
 #setlist-container-comp {
  background-color: #f1f1f1;
  border-radius: 7px;
  // padding-top: 2em;
 }
.setlist-container {
  padding-bottom: 1em;
  padding-top: 1em;
}
</style>