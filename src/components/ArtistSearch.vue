<template>
  <div>
    <div>
      <span class="text-w-svg">
        <h2>Artist</h2>
        <img src="@/assets/search.svg" class="icon-svg"/>
      </span>
      <vue-bootstrap-typeahead
        :data="artistSearchSuggestions"
        v-model="artistNameSearch"
        class="mb-4"
        size="lg"
        :serializer="s => s.name"
        placeholder="Artist name"
        @hit="setSelectedArtist"
      >
        <template slot="suggestion" slot-scope="{ data, htmlText }">
          <div class="d-flex align-items-center">
            <span class="ml-4" v-html="htmlText"></span>
            <span v-if="data.disambiguation" style="padding-left:20px;">({{ data.disambiguation }})</span>
          </div>
        </template>
      </vue-bootstrap-typeahead>
      <br>
    </div>
    <br>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'axios'
import { debounce } from 'underscore'

export default {
  name: "ArtistSearch",
  data() {
    return {
      artistSearchSuggestions: [],
      artistNameSearch: "",
      hasSelectedArtist: false
    }
  },

  computed: {
    ...mapState(['selectedArtist']),
  },

  methods: {
    async searchArtist(query) {
      let suggestions = await get("api/setlists/artist/" + query)
      if (suggestions.error) {
        this.makeErrorToast("Having issues search for artists, please try again");
      }
      this.artistSearchSuggestions = suggestions.data
    },
    setSelectedArtist(artist) {
      this.hasSelectedArtist = true
      this.$store.commit("setSelectedArtist", artist)
    }
  },

  watch: {
    artistNameSearch: debounce(function(artist) {
      if (this.hasSelectedArtist) {
        // skip search after clicking on venue in dropdown
        this.hasSelectedArtist = false
        return
      }
      this.searchArtist(artist)
    }, 500)
  }
}
</script>