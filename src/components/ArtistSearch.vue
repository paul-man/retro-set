<template>
  <div>
    <div>
      <h2>Search for an artist</h2>
      <vue-bootstrap-typeahead
        :data="artistsSearch"
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
      <br />
    </div>
    <br />
    <div v-if="selectedArtist.name">
      <h4>Selected artist</h4>
      <pre>{{ selectedArtist.name }}</pre>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from "axios"
import _ from "underscore"

export default {
  name: "ArtistSearch",
  data() {
    return {
      artistsSearch: [],
      artistNameSearch: "",
    }
  },

  computed: {
    ...mapState(['selectedArtist']),
  },

  methods: {
    async searchArtist(query) {
      const res = await axios.get("api/artist/" + query)
      let suggestions = await res
      suggestions = suggestions.data
      this.artistsSearch = suggestions
    },
    setSelectedArtist(artist) {
      this.selectedArtist = artist
      this.$store.commit("setSelectedArtist", artist)
    }
  },

  watch: {
    artistNameSearch: _.debounce(function(artist) {
      this.searchArtist(artist)
    }, 500)
  }
}
</script>