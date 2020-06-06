<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col" v-for="(set, index) in setlists" :key="index">
          <button
            type="button"
            class="btn btn-primary"
            @click="trackSearch(set)">
            Search Songs</button><br />
          Event date: {{ set.eventDate }}
          <br />
          <template v-if="set.tourName">{{ set.tourName }}</template>
          
          <template v-if="set.spotifyPreviews">
            <div class="container">
              <div v-for="preview in set.spotifyPreviews" v-bind:key="preview" class="row">
                <div v-html="preview.html"></div>
              </div>
            </div>
            <!-- <li v-for="preview in set.spotifyPreviews" v-bind:key="preview">
              <div v-html="preview.html"></div>
            </li> -->
          </template>
          <template v-else-if="set.songs">
            <ul>
              <li v-for="(song, index) in set.songs" :key="index">{{ song }}</li>
            </ul>
          </template>
        </div>
      </div>
    </div>
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
    ...mapState(["setlists", "selectedArtist"]),
  },

  methods: {
    async trackSearch(set) {
      set.spotifyPreviews = [];
      for (let track of set.songs) {
        const res = await axios.get("api/track/", {
          params: {
            track: track,
            artist: this.selectedArtist.name,
          },
        });
        let spotifyResp = await res;
        set.spotifyPreviews.push(spotifyResp.data.tracks);
      }
      this._proccessTracks(set);
    },
    _proccessTracks(set) {
      set.trackUriArr = [];
      for (let resp of set.spotifyPreviews) {
        if (resp.items.length === 0) continue;
        for (let item of resp.items) {
          set.trackUriArr.push(item.uri);
        }
      }
      this.createSongPreviews(set);
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
      this.$store.commit('setSetlists', this.setlists);
    },
    _processSetlists(setlists) {
      let allSongs = [];
      for (let subset of setlists.sets.set) {
        for (let song of subset.song) {
          if (allSongs.indexOf(song.name) === -1) {
            allSongs.push(song.name);
          }
        }
      }
      return allSongs;
    },
  },

  watch: {},
};
</script>
