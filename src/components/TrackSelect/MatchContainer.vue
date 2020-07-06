<template>
  <b-container
    class="matches-wrapper">
    <b-overlay
      :show="isLoading"
      rounded="sm">

      <!-- Matches container -->
      <template v-if="!isLoading && matches.length > 0">
        <b-container
          :class="containerClassname">
          <b-row
            class="match-div"
            v-for="(match, matchIndex) in matches"
            :key="matchIndex">
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
              class="float-right match-desc">
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
              No matches found for "{{ song.name }}" by
              {{ selectedArtist.name }}. Search for a replacement track or add it later at position
              {{ songIndex + 1 }}.
            </p>
            <p>
              Checkout the
              <a :href="set.url" target="_blank">setlist</a> for more
              information
            </p>
          </b-col>
        </b-row>
      </template>
    </b-overlay>
  </b-container>
</template>

<script>
import { get } from "axios";
import { mapState } from "vuex";
export default {
  name: "MatchContainer",
  components: {
  },
  props: ["song", "songIndex", "set", "setIndex"],
  data() {
    return {
      isLoading: true,
      trackSearchError: false,
      trackSearchErrorCode: null,
    };
  },

  mounted() {
    this.trackSearch(this.song);
  },

  computed: {
    ...mapState(["selectedArtist", "selectedVenue", "respCodes", "user"]),
    containerClassname() {
      if (this.song.matches && this.song.matches.length > 1) {
        return 'shadow rounded multiple';
      } else {
        return '';
      }
    },
    matches() {
      return this.song.matches;
    }
  },

  methods: {
    async trackSearch(song) {
      get("api/spotify/track/", {
        params: {
          track: song.name,
          artist: this.selectedArtist.name,
        },
      }).then( result => {
        song.matches = [];
        if (!result.data.error) {
          song.matches = result.data
        } else {
          this.trackSearchError = true;
          this.trackSearchErrorCode = result.data.status;
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
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.match-desc {
  text-align: left;
  padding: 10px;
  p {
    margin-bottom: 0;
  }
}

.album-art-col {
  padding-right: 0;
}

.spinner-border {
  color: $retro-green;
}

.no-match-warn {
  background-color: #fab0862d;
  border: 2px solid #fab086;
  border-radius: 5px;
  margin: 0 !important;
  padding-top: 0.5em;
}

.custom-control-input {
  position: relative !important;
}

.matches-wrapper {
  padding: 0 !important;
}

.matches-wrapper.multiple {
  border-right: solid 1px #e9e9e9;
  border-bottom: solid 1px #e9e9e9;
}

.match-div {
  padding-left: 0.5em;
  padding-top: 0.2em;
}

.matches-wrapper img {
  margin-right: 15px;
}

.match-desc {
  overflow-x: auto;
  white-space: nowrap;
  display: inline-block;
}

.match-desc > p {
  float: none;
  margin-bottom: 0;
}
</style>