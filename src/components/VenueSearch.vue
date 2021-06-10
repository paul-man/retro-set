<template>
  <b-container id="venue-search">
    <b-overlay
      :show="isLoading"
      spinner-variant="success"
      no-center
      opacity="0.4"
      rounded="sm"
    >
      <template v-slot:overlay>
        <b-spinner variant="success" class="text-field-spinner"></b-spinner>
      </template>
      <vue-typeahead-bootstrap
        id="venue-input"
        :data="venueSearchSuggestions"
        v-model="venueName"
        class="mb-4"
        size="lg"
        :serializer="(s) => s.name"
        placeholder="Venue name"
        @hit="setSelectedVenue"
      >
        <template slot="suggestion" slot-scope="{ data, htmlText }">
          <div class="d-flex align-items-center">
            <span class="ml-4" v-html="htmlText"></span>
            <span class="float-right" style="padding-left: 20px"
              >({{ data.city.name }}, {{ data.city.country.code }})</span
            >
          </div>
        </template>
      </vue-typeahead-bootstrap>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { get } from "axios";
import { debounce } from "underscore";

export default {
  name: "VenueSearch",
  data() {
    return {
      venueSearchSuggestions: [],
      venueName: "",
      hasSelectedVenue: false,
      isLoading: false,
    };
  },

  computed: {
    ...mapState(["selectedVenue"]),
  },

  methods: {
    async searchVenue(query) {
      let suggestions = await get("api/setlists/venue/" + query);
      if (suggestions.error) {
        this.makeErrorToast(
          "Having issues search for venues, please try again"
        );
      }
      this.venueSearchSuggestions = suggestions.data;
      this.isLoading = false;
    },
    setSelectedVenue(venue) {
      this.hasSelectedVenue = true;
      this.$store.commit("setSelectedVenue", venue);
    },
  },

  watch: {
    venueName: debounce(function (venue) {
      if (this.hasSelectedVenue) {
        // skip search after clicking on venue in dropdown
        this.hasSelectedVenue = false;
        return;
      }
      this.isLoading = true;
      this.searchVenue(venue);
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
#venue-search {
  padding: 0;
}

.text-field-spinner {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>