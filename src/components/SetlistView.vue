<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-5 col-md-6 setlist-container" v-for="(set, index) in setlists" :key="index">
          <b-container class="float-right" style="text-align:right; padding-top:1em;">
            <b-button v-b-toggle="'set-collapse-'+index" variant="outline-primary">
              <b-icon-plus></b-icon-plus>
            </b-button>
          </b-container>
          <b-collapse :id="'set-collapse-'+index" visible class="mt-2">
            <p class="setData">
              Event date: {{ set.eventDate }}<br>
              Songs played: {{ set.songs.length }}<br>
              <a :href="set.url" target="_blank">More setlist Data</a>
            </p>
            <template v-if="set.tourName">{{ set.tourName }}</template>
            <b-button variant="primary" @click="openTrackSelctPanel(set, index)">Search Songs</b-button><br><br>
            <template v-if="set.spotifyPreviews">
              <div class="container">
                <div v-for="preview in set.spotifyPreviews" v-bind:key="preview" class="row">
                  <div class="spotify-widget-container" v-html="preview.html"></div>
                </div>
              </div>
            </template>
            <template v-else-if="set.songs">
              <b-list-group class="songlist">
                <b-list-group-item v-for="(song, index) in set.songs" :key="index">
                  {{ song.name }}
                </b-list-group-item>
              </b-list-group>
            </template>
          </b-collapse>
        </div>
      </div>
    </div>
    <slideout-panel/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get } from 'axios'

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
        disableBgClick: true,
        props: {
          set: set
        }
      })
      trackSelctPanel.promise
        .then(set => {
          if (set) {
            this.setlists[index] = set;
            this.$store.commit('setSetlists', this.setlists);
            this.createPlaylist(set, index)
          }
        })
    },
    async createPlaylist(set, index) {
      let res = await get('api/spotify/create_playlist/', {
        params: {
          user: this.user.id,
          songs: set.spotifyUris,
          name: set.playlistName,
          description: set.playlistDescription,
          visibility: set.playlistVisibility
        }
      });
      if (res.error) {
        this.makeErrorToast('Can\'t create playlist at this time');
      }
      
      set.spotifyPreviews = [ { html: `<iframe src="https://open.spotify.com/embed/playlist/${res.data.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>` } ]
      this.setlists[index] = set;
      this.$store.commit('setSetlists', this.setlists);
    }
  },

  watch: {},
};
</script>

<style scoped>

 /* Add border between mutliple setlists */
.setlist-container {
  border: solid 1px rgba(211, 211, 211, 0.459);
  border-radius: 2px;
  padding-bottom: 15px;
}
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

.spotify-widget-container {
  width: 100%;
}
</style>