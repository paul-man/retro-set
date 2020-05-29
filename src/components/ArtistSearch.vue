<template>
  <div>
    <div>
      <h2>Search for an artist</h2>
      <vue-bootstrap-typeahead
        :data="artists"
        v-model="artistName"
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
    <div v-if="selectedArtist">
      <h4>Selected artist</h4>
      <pre>{{ this.$store.getters.selectedArtist }}</pre>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import _ from "underscore"

export default {
  name: "ArtistSearch",
  data() {
    return {
      artists: [],
      artistName: "",
      selectedArtist: null
    }
  },

  methods: {
    async searchArtist(query) {
      const res = await axios.get("api/artist/" + query)
      let suggestions = await res
      suggestions = suggestions.data
      this.artists = suggestions
    },
    setSelectedArtist(artist) {
      this.selectedArtist = artist
      this.$store.commit("setSelectedArtist", {
        artistId: artist.mbid,
        artistName: artist.name
      })
    }
  },
  watch: {
    artistName: _.debounce(function(artist) {
      this.searchArtist(artist)
    }, 500)
  }
}
</script>