<template>
  <div id="spotify-song-search">
    <b-container>

      <!-- Song name search -->
      <b-row id="song-input-row">
        <b-col cols="2">
          <label for="song-input">Song</label>
        </b-col>
        <b-col>
          <b-form-input
            v-model="songNameSearch"
            id="song-input"
            type="text"></b-form-input>
        </b-col>
      </b-row>

      <!-- Artist name search -->
      <b-row id="artist-input-row">
        <b-col cols="2">
          <label for="artist-input">Artist</label>
        </b-col>
        <b-col>
          <b-form-input
            v-model="artistNameSearch"
            id="artist-input"
            type="text"></b-form-input>
        </b-col>
      </b-row>

      <!-- Spotify results -->
      <b-row id="search-results-container">
        <b-col>
          <template v-if="incompleteSearchTerms">
            <b-container class="search-results-text">
              <p>Search for a song and artist to select results</p>
            </b-container>
          </template>
          <template v-else-if="songSuggestions.length === 0">
            <b-container class="search-results-text">
              <p>Sorry, no results</p>
            </b-container>
          </template>
          <template v-else>
            <b-container>
              <b-row v-for="(song, index) in songSuggestions" :key="index">
                <b-col cols="1" class="add-song-btn-col">
                  <div class="add-song-btn-div">
                    <b-button size="sm" class="mb-2 add-song-btn bouncy-btn" title="Add song to matches list" @click="selectSong(song)">
                      <b-icon icon="plus-circle" variant="primary" aria-hidden="true"></b-icon>
                    </b-button>
                  </div>
                </b-col>
                <b-col cols="2" class="album-art-col">
                  <div>
                    <img class="center-img" :src="getAlbumImg(song.albumImageUrl)"/>
                  </div>
                </b-col>
                <b-col cols="9" class="song-search-data">
                  <p>Title: {{ song.songTitle }}</p>
                  <p>Artist: {{ song.artistName }}</p>
                  <p>Album: {{ song.albumTitle }}</p>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get } from "axios";
import { debounce } from "underscore";

export default {
  name: "SpotifySongSearch",

  components: {},

  props: ["songIndex", "setIndex"],

  data() {
    return {
      songNameSearch: "",
      artistNameSearch: "",
      songSuggestions: [],
      // TODO: There's gotta be a better way!
      songPayload: {},
      matchesPayload: {},
    };
  },

  computed: {
    ...mapState(["selectedArtist", "currentSongName", "setlists", "songs"]),
    incompleteSearchTerms() {
      return this.songNameSearch === '' ||  this.artistNameSearch === '';
    },
    currentMatches() {
      return this.song.matches.map( match => match.id );
    },
    set() {
      return this.$store.getters.setlists[this.setIndex];
    },
    song() {
      let songID = this.$store.getters.setlists[this.setIndex].songs[this.songIndex];
      return this.$store.getters.songs[songID];
    },
  },
  
  mounted() {
    this.artistNameSearch = this.set.artist.name;
    this.songNameSearch = this.currentSongName;
    
    // TODO: There's gotta be a better way!
    this.songPayload = {
      setIndex: this.setIndex,
      songIndex: this.songIndex,
      song: {},
    };
    this.matchesPayload = {
      setIndex: this.setIndex,
      songIndex: this.songIndex,
      matches: [],
    }
  },

  methods: {
    async searchSong() {
      const spotifyResp = await get("api/spotify/song/", {
        params: {
          song: this.songNameSearch,
          artist: this.artistNameSearch,
        },
      });
      if (spotifyResp.data.error) {
        this.songSearchError = true;
      }
      this.songSuggestions = spotifyResp.data;
    },
    selectSong(song) {
      // if (this.isDuplicateSong(song.id)) {
      if (this.currentMatches.indexOf(song.id) !== -1) {
        this.makeWarningToast('This song is already in the song matches!');
        return;
      }

      if (typeof this.song.matches === 'undefined') {
        this.matchesPayload.matches = [];
        this.$store.commit('setSongMatches', this.matchesPayload);
      }

      this.songPayload.song = song;
      this.$store.commit('addSongMatch', this.songPayload);
      // this.$parent.$parent.$parent.$parent.$forceUpdate();
      this.$bvModal.hide(`spotify-search-modal-${this.songIndex}`);
    },
  },

  watch: {
    songNameSearch: debounce(function() {
      this.searchSong();
    }, 750),
    artistNameSearch: debounce(function() {
      this.searchSong();
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

.add-song-btn-div {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.add-song-btn {
  border: 0 !important;
  background-color: transparent !important;
}

.album-art-col {
  padding: 0;
}

.add-song-btn-col {
  padding:0;
}
</style>
