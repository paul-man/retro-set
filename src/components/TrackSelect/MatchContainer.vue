<template>
  <b-container
    :id="'matches-wrapper-' + songIndex"
    class="matches-wrapper">
    <b-overlay
      :show="isLoading"
      spinner-variant="success"
      rounded="sm">

      <!-- Matches container -->
      <template v-if="!isLoading && song.matches.length > 0">
        <b-container
          :class="containerClassname">
          <b-row
            class="match-div"
            v-for="(match, matchIndex) in song.matches"
            :key="match.id">
            {{ setDefaultMatch(song, match.uri, matchIndex) }}

            <!-- Radio col -->
            <b-col sm="1" class="radio-col">
              <b-form-radio
                variant="primary"
                v-model="song.selectedUri"
                :value="match.uri"
                :name="'match-' + songIndex"/>
            </b-col>

            <!-- Album art col -->
            <b-col sm="3" class="album-art-col">
              <img
                :src="getAlbumImg(match.albumImageUrl)"
                class="img-md">
            </b-col>

            <!-- Song data col -->
            <b-col
              sm="8"
              class="float-right match-description">
              <p>
                <span class="bold">Title:</span> {{ match.songTitle}}
              </p>
              <p>
                <span class="bold">Artist:</span> {{ match.artistName}}
              </p>
              <p>
                <span class="bold">Album:</span> {{ match.albumTitle }}
              </p>
            </b-col>
          </b-row>
        </b-container>
      </template>

      <!-- No matches found -->
      <template v-else>
        <b-row class="no-match-warn">
          <b-col>
            <p>
              <template v-if="trackSearchError">
                There was an unexpected error when searching for "{{ song.name }}" by {{ selectedArtist.name }}. 
              </template>
              <template v-else>
                No matches found for "{{ song.name }}" by {{ selectedArtist.name }}. 
              </template>
              Please search for a replacement track or add it later at position {{ songIndex + 1 }}.
            </p>
            <p>
              Check out the
              <a :href="set.url" target="_blank">setlist</a> for more information
            </p>
          </b-col>
        </b-row>
      </template>
      
      <!-- Add Track button/modal row -->
      <b-row class="add-song-action-row">
        <b-col class="add-song-btn-col">
          <b-button
            size="sm"
            class="mb-2 add-song-btn"
            title="Search Spotify for song"
            @click="openTrackSearchModal()">
            <b-icon icon="music-note" aria-hidden="true"></b-icon>+
          </b-button>
          <b-modal
            no-close-on-backdrop
            hide-footer
            :id="'spotify-search-modal-' + songIndex"
            title="Search a track"
            size="lg">
            <spotify-track-search
              :songIndex="songIndex"
              :setIndex="setIndex"/>
          </b-modal>
        </b-col>
      </b-row>
    </b-overlay>
  </b-container>
</template>

<script>
import Vue from "vue";
import SpotifyTrackSearch from "@/components/SpotifyTrackSearch";
import { get } from "axios";
import { mapState } from "vuex";

export default {
  name: "MatchContainer",

  components: {
    SpotifyTrackSearch,
  },

  props: ["songIndex", "setIndex"],

  data() {
    return {
      isLoading: true,
      trackSearchError: false,
      matchesPayload: {
        setIndex: this.setIndex,
        songIndex: this.songIndex,
        matches: [],
      },
    };
  },

  computed: {
    ...mapState(["selectedArtist"]),
    containerClassname() {
      if (this.song.matches && this.song.matches.length > 1) {
        return 'shadow rounded multiple';
      }
      return '';
    },
    set() {
      return this.$store.getters.setlists[this.setIndex];
    },
    song() {
      return this.$store.getters.setlists[this.setIndex].songs[this.songIndex];
    },
  },

  mounted() {
    this.trackSearch(this.song);
  },

  methods: {
    async trackSearch(song) {
      get("api/spotify/track/", {
        params: {
          track: song.name,
          artist: this.selectedArtist.name,
        },
      }).then( result => {
        this.matchesPayload.matches = [];
        this.$store.commit('setSongMatches', this.matchesPayload);
        if (!result.data.error) {
          this.matchesPayload.matches = result.data;
          this.$store.commit('setSongMatches', this.matchesPayload);
        } else {
          this.trackSearchError = true;
        }
        this.isLoading = false;
      }).catch( error => {
        this.isLoading = false;
        this.makeErrorToast(error);
      });
    },
    setDefaultMatch(song, uri, index) {
      if (index === 0) {
        song.selectedUri = uri;
      }
    },
    openTrackSearchModal() {
      this.$store.commit("setCurrentSongName", this.song.name);
      this.$bvModal.show(`spotify-search-modal-${this.songIndex}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.match-description {
  text-align: left;
  padding: 10px;
  overflow-x: auto;
  white-space: nowrap;
  display: inline-block;
  p {
  float: none;
    margin-bottom: 0;
  }
}

.match-div {
  padding-left: 0.5em;
  padding-top: 0.2em;
}

.album-art-col {
  padding-right: 0;
}

.no-match-warn {
  background-color: #fab0862d;
  border: 2px solid #fab086;
  border-radius: 5px;
  margin: 0 !important;
  padding-top: 0.5em;
}

.add-song-action-row {
  margin: 0;
  .col {
    padding: 0;
  }
}

.matches-wrapper {
  padding: 0 !important;
  img {
    margin-right: 15px;
  }
}

.multiple {
  border: 1px solid #e9e9e9;
  margin-top: 2px !important;
}
</style>