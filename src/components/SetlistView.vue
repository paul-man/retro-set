<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-6 col-md-4" v-for="(set, index) in setlists" :key="index">
          <button
            type="button"
            class="btn btn-primary"
            @click="openTrackSelctPanel(setlists, index)">
            Search Songs</button><br />
          <p class="setData">
            Event date: {{ set.eventDate | prettyDate }}<br>
            Songs played: {{ set.songs.length }}
          </p>
          <br />
          <template v-if="set.tourName">{{ set.tourName }}</template>
          
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
    openTrackSelctPanel(setlists, index) {
      /* eslint-disable-next-line no-unused-vars */
      const trackSelctPanel = this.$showPanel({
        component : 'track-select',
        cssClass: 'tracklistPanel',
        props: {
          setlists: setlists,
          setIndex: index
        }
      })
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