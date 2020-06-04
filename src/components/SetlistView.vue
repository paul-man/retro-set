<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col" v-for="(set, index) in setlists" :key="index">
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

export default {
  name: "SetlistView",

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["setlists"])
  },

  methods: {
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