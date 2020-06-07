<template>
  <div id="track-select" :key="componentKey">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Song</th>
          <th scope="col">Spotify Matches</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, songIndex) in set.songs" :key="songIndex">
          <th scope="row">{{ songIndex + 1 }}</th>
          <td>{{ song.name }}</td>
          <td>
            <template v-if="!song.matches">
              <div class="spinner-border text-success" role="status">
              </div>
            </template>
            <template v-else>
              <div class="container songMatchContainer">
                <div class="row" v-for="(match, matchIndex) in song.matches" :key="matchIndex" >
                  <div class="form-check">
                    <input type="radio" class="form-check-input" :name="'match-' + songIndex" :checked="song.matches.length === 1" :disabled="song.matches.length === 1"/>
                  </div>
                  <p style="float: left;">
                    <img :src="match.albumImageUrl" height="64px" width="64px" border="1px" />
                  </p>
                  <p style="text-align: left;">
                    <span class="bold">Album:</span> {{ match.albumTitle }}<br>
                    <span class="bold">Title:</span> {{ match.songTitle }}
                  </p>
                </div>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <pre class="jsonView">{{ set | stringify }}</pre><br>
    <button type="button" class="btn btn-primary" @click="refreshSetlists">
      Save changes
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "track-select",
  props: ["setlists", "setIndex"],
  data() {
    return {
      set: {},
      componentKey: 0
    };
  },

  computed: {
    ...mapState(["selectedArtist"]),
  },

  async mounted() {
    this.set = this.setlists[this.setIndex];
    for (let song of this.set.songs) {
      let matches = await this.trackSearch(song);
      song.matches = matches
    }
    this.forceRerender()
  },

  methods: {
    async trackSearch(song) {
      song.matches = [];
      const res = await axios.get("api/track/", {
        params: {
          track: song.name,
          artist: this.selectedArtist.name,
        },
      });
      let spotifyResp = await res;
      return spotifyResp.data;
    },
    createSongPreviews(set) {
      set.spotifyPreviews = [];
      for (let uri of set.trackUriArr) {
        uri = uri.split(":")[2];
        let src = `https://open.spotify.com/embed/track/${uri}`;
        set.spotifyPreviews.push({
          html: `<iframe src="${src}" width="250" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`,
        });
      }
      this.$store.commit("setSetlists", this.setlists);
    },
    refreshSetlists() {
      this.setlists[this.setIndex] = this.set;
      this.$store.commit("setSetlists", this.setlists);
    },
    forceRerender() {
      this.componentKey += 1;  
    }
  },

  watch: {},
};
</script>

<style scoped>
.jsonView {
  text-align: left;
}

.form-check {
  padding-top: 22px;
}

.songMatchContainer img {
  margin-right: 15px;
}
</style>
