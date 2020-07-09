<template>
  <b-container id="venue-search">
    <b-row align-h="center">
      <b-col sm="4" align-self="center">
        <h2 class="inline-heading">Venue</h2>
        <b-icon icon="search" class="search-icon"></b-icon>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <vue-bootstrap-typeahead
          :data="venueSearchSuggestions"
          v-model="venueName"
          class="mb-4"
          size="lg"
          :serializer="s => s.name"
          placeholder="..."
          @hit="setSelectedVenue">
          <template slot="suggestion" slot-scope="{ data, htmlText }">
            <div class="d-flex align-items-center">
              <span class="ml-4" v-html="htmlText"></span>
              <span class="float-right" style="padding-left:20px;">({{ data.city.name }}, {{ data.city.country.code }})</span>
            </div>
          </template>
        </vue-bootstrap-typeahead>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'axios'
import { debounce } from 'underscore'

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
      let suggestions = await get("api/setlists/venue/" + query)
      if (suggestions.error) {
        this.makeErrorToast('Having issues search for venues, please try again')
      }
      this.venueSearchSuggestions = suggestions.data
    },
    setSelectedVenue(venue) {
      this.hasSelectedVenue = true
      this.$store.commit("setSelectedVenue", venue)
    }
  },

  watch: {
    venueName: debounce(function(venue) {
      if (this.hasSelectedVenue) {
        // skip search after clicking on venue in dropdown
        this.hasSelectedVenue = false
        return
      }
      this.searchVenue(venue)
    }, 500)
  }
}
</script>

<style lang="scss" scoped>

</style>