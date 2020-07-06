<template>
  <div id="spotify-track-search">
    <b-container>
      <b-row id="track-input-row">
        <b-col sm="1">
          <label for="track-input">Track</label>
        </b-col>
        <b-col sm="8">
          <b-form-input v-model="trackNameSearch" id="track-input" type="text"></b-form-input>
        </b-col>
      </b-row>
      <b-row id="artist-input-row">
        <b-col sm="1">
          <label for="artist-input">Artist</label>
        </b-col>
        <b-col sm="8">
          <b-form-input v-model="artistNameSearch" id="artist-input" type="text"></b-form-input>
        </b-col>
      </b-row>
      <b-row id="search-results-container">
        <b-col v-if="incompleteSearchTerms">
          <b-container class="search-results-text">
            <p>Search for a track and artist to select results</p>
          </b-container>
        </b-col>
        <b-col v-else-if="trackSuggestions.length === 0">
          <b-container class="search-results-text">
            <p>Sorry, no results</p>
          </b-container>
        </b-col>
        <b-col v-else>
          <b-container>
            <b-row v-for="(track, index) in trackSuggestions" :key="index">
              <b-col sm="1" class="add-track-btn-col">
                <div class="add-track-btn-div">
                  <b-button size="sm" class="mb-2 add-song-btn" title="Add song to matches list" @click="selectSong(track)">
                    <b-icon icon="plus-circle" variant="primary" aria-hidden="true"></b-icon>
                  </b-button>
                </div>
              </b-col>
              <b-col sm="2" class="album-art-col">
                <img
                  :src="getAlbumImg(track.albumImageUrl)"
                  class="img-md"/>
              </b-col>
              <b-col sm="9" class="song-search-data">
                <p>Title: {{ track.songTitle }}</p>
                <p>Artist: {{ track.artistName }}</p>
                <p>Album: {{ track.albumTitle }}</p>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get } from "axios";
import { debounce } from "underscore";
import Vue from "vue";
export default {
  name: "SpotifyTrackSearch",
  components: {},
  props: ["song", "songIndex", "set", "setIndex"],
  data() {
    return {
      trackNameSearch: "",
      artistNameSearch: "",
      trackSuggestions: [],
    };
  },
  mounted() {
    this.artistNameSearch = this.selectedArtist.name;
    this.trackNameSearch = this.currentSongToSearch;
  },

  computed: {
    ...mapState(["selectedArtist", "currentSongToSearch", "setlists"]),
    incompleteSearchTerms() {
      return this.trackNameSearch === '' ||  this.artistNameSearch === '';
    }
  },
  methods: {
    async searchTrack() {
      const spotifyResp = await get("api/spotify/track/", {
        params: {
          track: this.trackNameSearch,
          artist: this.artistNameSearch,
        },
      });
      if (spotifyResp.data.error) {
        this.trackSearchError = true;
        this.trackSearchErrorCode = spotifyResp.data.status;
        return {
          warning: "Unable to retrieve resutls",
        };
      }
      this.trackSuggestions = spotifyResp.data;
    },
    selectSong(track) {
      if (typeof this.song.matches === 'undefined') {
        this.song.matches = [];
      }
      this.song.matches.push(track);
      console.log(this.setlists[this.setIndex].songs[this.songIndex])
      this.setlists[this.setIndex].songs[this.songIndex] = this.song;
      this.$store.commit('setSetlists', this.setlists);

      console.log(this.setlists[this.setIndex].songs[this.songIndex])
      // Vue.set(this.song.matches, this.song.matches.length, track);
      this.$bvModal.hide(`spotify-search-modal${this.songIndex}`);
    }
  },

  watch: {
    trackNameSearch: debounce(function() {
      this.searchTrack();
    }, 750),
    artistNameSearch: debounce(function() {
      this.searchTrack();
    }, 750),
  },
};
</script>

<style lang="scss" scoped>
#search-results-container {
  height: 300px;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-top: 0.5em;
  overflow-y: auto;
}

#search-results-container .row {
  padding-top: 10px;
  padding-bottom: 10px;
}

#search-results-container > .col {
  padding-left: 0.25em;
}

.song-search-data > p {
  margin-bottom: 0;
}

.search-results-text {
  text-align: center;
  top: 45%;
  position:absolute;
}

.add-track-btn-div {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.album-art-col {
  padding: 0;
}

.add-song-btn {
  border: 0;
  background-color: transparent;
}

.add-track-btn-col {
  padding:0;
}
</style>
