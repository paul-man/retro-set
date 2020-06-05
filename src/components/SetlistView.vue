<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col" v-for="(set, index) in setlists" :key="index">
          <button type="button" class="btn btn-primary" @click="trackSearch(set)">Search Songs</button><br>
          Event date: {{ set.eventDate }}
          <br />
          <template v-if="set.tourName">{{ set.tourName }}</template>
          <ul>
            <li v-for="(song, index) in _processSetlists(set)" :key="index">{{ song }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "SetlistView",

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["setlists"])
  },

  methods: {
    async trackSearch(setlist) {
      let tracks = this._processSetlists(setlist);
      for (let track of tracks) {
        const res = await axios.get("api/track/", {
          params: {
            track: track,
            artist: this.$store.getters.selectedArtist.name
          }
        });
        let resp = await res;
        this.spotifyResp.push(resp.data.tracks);
      }

      this._proccessTracks(this.spotifyResp);
    },
    searchSongs(set) {
      set = this._processSetlists(set);
      console.log(set)
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
    }
  },

  watch: {}
  
};
</script>