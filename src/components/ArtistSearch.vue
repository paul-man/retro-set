<template>
  <b-container id="artist-search">
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
        id="artist-input"
        :data="artistSearchSuggestions"
        v-model="artistNameSearch"
        class="mb-4"
        size="lg"
        :serializer="(s) => s.name"
        placeholder="Artist name"
        @hit="setSelectedArtist"
      >
        <template slot="suggestion" slot-scope="{ data, htmlText }">
          <div class="d-flex align-items-center">
            <span class="ml-4" v-html="htmlText"></span>
            <span
              v-if="data.disambiguation"
              class="pull-right"
              style="padding-left: 20px"
              >({{ data.disambiguation }})</span
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
  name: "ArtistSearch",
  data() {
    return {
      artistSearchSuggestions: [],
      artistNameSearch: "",
      hasSelectedArtist: false,
      isLoading: false,
    };
  },

  computed: {
    ...mapState(["selectedArtist"]),
  },

  methods: {
    async searchArtist(query) {
      let suggestions = await get("api/setlists/artist/" + query);
      if (suggestions.error) {
        this.makeErrorToast(
          "Having issues search for artists, please try again"
        );
      }
      this.artistSearchSuggestions = suggestions.data;
      this.isLoading = false;
    },
    setSelectedArtist(artist) {
      this.hasSelectedArtist = true;
      this.$store.commit("setSelectedArtist", artist);
    },
  },

  watch: {
    artistNameSearch: debounce(function (artist) {
      if (this.hasSelectedArtist) {
        // skip search after clicking on venue in dropdown
        this.hasSelectedArtist = false;
        return;
      }
      this.isLoading = true;
      this.searchArtist(artist);
    }, 500),
  },
};
</script>

<style lang="scss">
#artist-search {
  padding: 0;
}

.text-field-spinner {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
