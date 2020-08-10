<template>
  <b-container
    id="results-div">
    <b-row
      align-h="start">
      <b-col 
        v-if="selectedArtist"
        cols="3">
        Artist: <a :href="selectedArtist.url">{{selectedArtist.name}}</a>
      </b-col>
      <b-col 
        v-if="selectedVenue"
        cols="3">
        Venue: <a :href="selectedVenue.url">{{selectedVenue.name}}</a>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        lg="12"
        class="setlist-wrapper"
        v-for="(set, index) in setlists" :key="index">
        <setlist
          :setIndex="index"/>
      </b-col>
    </b-row>
    
    <!-- Slideout panel for playlist creation -->
    <slideout-panel/>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import Setlist from "@/components/setlist/Setlist"

export default {
  name: "SetlistResults",

  components: {
    Setlist,
  },

  data() {
    return {
      templates: [],
    };
  },

  computed: {
    ...mapState(["setlists", "selectedArtist", "selectedVenue"]),
  },

  methods: {
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
#results-div {
  background-color: #FFF;
}

.setlist-wrapper:last-child {
  margin-bottom: 1em;
}
</style>