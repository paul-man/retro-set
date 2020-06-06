<template>
  <div>
    <div>
      <h2>Search for a venue</h2>
      <vue-bootstrap-typeahead
        :data="venues"
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
      <br />
    </div>
    <br />
    <div v-if="selectedVenue.name">
      <h4>Selected Venue</h4>
      <pre>{{ selectedVenue.name }}</pre>
    </div>
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
      venues: [],
      venueName: "",
    }
  },

  computed: {
    ...mapState(['selectedVenue']),
  },

  methods: {
    async searchVenue(query) {
      const res = await axios.get("api/venue/" + query)
      let suggestions = await res
      suggestions = suggestions.data
      this.venues = suggestions
    },
    setSelectedVenue(venue) {
      this.selectedVenue = venue
      this.$store.commit("setSelectedVenue", venue)
    }
  },

  watch: {
    venueName: _.debounce(function(venue) {
      this.searchVenue(venue)
    }, 500)
  }
}
</script>