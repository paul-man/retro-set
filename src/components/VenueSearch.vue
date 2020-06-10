<template>
  <div>
    <div>
      <span class="text-w-svg">
        <h2>Venue</h2>
        <img 
          src="@/assets/search.svg" 
          class="icon-svg"/>
      </span>
      <vue-bootstrap-typeahead
        :data="venueSearchSuggestions"
        v-model="venueName"
        class="mb-4"
        size="lg"
        :serializer="s => s.name"
        placeholder="Venue name"
        @hit="setSelectedVenue"
      >
        <template slot="suggestion" slot-scope="{ data, htmlText }">
          <div class="d-flex align-items-center">
            <span class="ml-4" v-html="htmlText"></span>
            <span style="padding-left:20px;">({{ data.city.name }}, {{ data.city.country.code }})</span>
          </div>
        </template>
      </vue-bootstrap-typeahead>
      <br>
    </div>
    <br>
    <!-- Debugging purposes -->
    <!-- <div v-if="selectedVenue.name">
      <h4>Selected Venue</h4>
      <pre>{{ selectedVenue.name }}</pre>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from "axios"
import _ from "underscore"

export default {
  name: "VenueSearch",
  data() {
    return {
      venueSearchSuggestions: [],
      venueName: "",
      hasSelectedVenue: false
    }
  },

  computed: {
    ...mapState(['selectedVenue']),
  },

  methods: {
    async searchVenue(query) {
      let suggestions = await axios.get("api/venue/" + query)
      this.venueSearchSuggestions = suggestions.data
    },
    setSelectedVenue(venue) {
      this.hasSelectedVenue = true
      this.$store.commit("setSelectedVenue", venue)
    }
  },

  watch: {
    venueName: _.debounce(function(venue) {
      if (this.hasSelectedVenue) { // skip search after clicking on venue in dropdown
        this.hasSelectedVenue = false
        return
      }
      this.searchVenue(venue)
    }, 500)
  }
}
</script>

<style scoped>

</style>