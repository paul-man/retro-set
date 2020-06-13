<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-6 col-md-4" v-for="(set, index) in setlists" :key="index">
          <p class="setData">
            Event date: {{ set.eventDate | prettyDate }}<br>
            Songs played: {{ set.songs.length }}<br>
            <a :href="set.url" target="_blank">More setlist Data</a>
          </p>
          <template v-if="set.tourName">{{ set.tourName }}</template>
          <button
            type="button"
            class="btn btn-primary"
            @click="openTrackSelctPanel(set, index)">
            Search Songs</button><br><br>
          <template v-if="set.spotifyPreviews">
            <div class="container">
              <div v-for="preview in set.spotifyPreviews" v-bind:key="preview" class="row">
                <div v-html="preview.html"></div>
              </div>
            </div>
          </template>
          <template v-else-if="set.songs">
            <ul class="songlist">
              <li v-for="(song, index) in set.songs" :key="index">#{{index+1}}: {{ song.name }}</li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <slideout-panel/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "SetlistView",

  data() {
    return {
      templates: [],
    };
  },

  computed: {
    ...mapState(["setlists", "selectedArtist", "user"]),
  },

  methods: {
    openTrackSelctPanel(set, index) {
      /* eslint-disable-next-line no-unused-vars */
      const trackSelctPanel = this.$showPanel({
        component : 'track-select',
        cssClass: 'tracklistPanel',
        props: {
          set: set
        }
      })
      trackSelctPanel.promise
        .then(set => {
          this.setlists[index] = set;
          this.$store.commit('setSetlists', this.setlists);
          this.createPlaylist(set)
        })
    },
    async createPlaylist(set) {
      let res = axios.get('api/spotify/create_playlist/', {
        params: {
          user: this.user.id,
          songs: set.spotifyUris,
          playlistName: set.playlistName
        }
      });
    }
  },

  watch: {},
};
</script>

<style scoped>
.songlist {
  list-style-type: none;
  text-align: left;
}
.songlist > li {
  border-bottom: solid 2px;
  border-color: lightgray;
}

.setData {
  font-weight: bold;
  padding-top: 15px;
}
</style>