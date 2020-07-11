<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-6 setlist-container" v-for="(set, index) in setlists" :key="index">
          <b-container class="float-right" style="text-align:right; padding-top:1em;">
            <b-navbar-toggle :target="'set-collapse-'+index">
              <template v-slot:default="{ expanded }">
                <b-icon v-if="expanded" variant="primary" icon="dash-square"></b-icon>
                <b-icon v-else variant="primary" icon="plus-square"></b-icon>
              </template>
            </b-navbar-toggle>
          </b-container>
          <p class="font-weight-bold">
            Event date: {{ set.eventDate }}
          </p>
          <p class="font-weight-bold" v-if="set.tourName">
            Tour Name: {{ set.tourName }}
          </p>
          <p class="font-weight-bold">
            Songs played: {{ set.songs.length }}
          </p>
          <p class="font-weight-bold">
            <a :href="set.url" target="_blank">More setlist Data</a>
          </p>
          <b-button
            variant="primary"
            @click="openSongSelctPanel(set, index)">
            Confirm Songs
          </b-button>
          <template v-if="set.spotifyPreviews">
            <div class="container">
              <div v-for="(preview, index) in set.spotifyPreviews" :key="index" class="row">
                <div class="spotify-widget-container" v-html="preview.html"></div>
              </div>
            </div>
          </template>
          <template v-if="set.songs">
            <b-collapse :id="'set-collapse-'+index" class="mt-2">
              <b-list-group class="songlist">
                <b-list-group-item v-for="(song, index) in set.songs" :key="index">
                  {{ song.name }}
                </b-list-group-item>
              </b-list-group>
            </b-collapse>            
          </template>
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
    openSongSelctPanel(set, index) {
      const songSelctPanel = this.$showPanel({
        component : 'song-select',
        cssClass: 'songlistPanel',
        disableBgClick: true,
        props: {
          setIndex: index
        }
      })
      songSelctPanel.promise
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

.set-data {
  font-weight: bold;
}

.spotify-widget-container {
  width: 100%;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>