<template>
  <b-row class="setlist-result-row rounded shadow-lg pb-2 mb-4 ml-2 mr-2">
    
    <!-- Expand button -->
    <b-col cols="1">
      <b-navbar-toggle :target="'set-collapse-'+setIndex">
        <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" variant="primary" icon="dash-square"></b-icon>
          <b-icon v-else variant="primary" icon="plus-square"></b-icon>
        </template>
      </b-navbar-toggle>
    </b-col>
    
    <!-- Artist image -->
    <b-col cols="2">
      <img :src="set.artist.imgUrl" height="64" width="64">
    </b-col>
    
    <!-- Set Data (artist name, venue, # songs, etc?) -->
    <b-col cols="6">
      <b-row>
        <b-col>
          <p>Artist: <a :href="set.artist.url">{{ set.artist.name }}</a></p>
          <p>Venue: <a :href="set.venue.url">{{ set.venue.name }}</a></p>
        </b-col>
        <b-col>
          <p>Event date: {{ set.eventDate }}</p>
          <p v-if="set.tourName">Tour Name: {{ set.tourName }}</p>
        </b-col>
        <b-col>
          <p>Songs played: {{ set.songs.length }}</p>
          <p><a :href="set.url" target="_blank">More setlist Data</a></p>
        </b-col>
      </b-row>
    </b-col>
    
    <!-- Create playlist button -->
    <b-col cols="3">
      <b-button
        variant="primary"
        @click="openSongSelctPanel()">
        Create Playlist
      </b-button>
    </b-col>

    <b-col cols="12">
      <b-row>
        <b-col>
          <b-collapse :id="'set-collapse-'+setIndex" class="mt-2">

            <!-- Spotify preview -->
            <template v-if="set.spotifyPreview">
              <div class="container">
                <div class="row">
                  <div class="spotify-widget-container" v-html="set.spotifyPreview.html"></div>
                </div>
              </div>
            </template>

            <!-- Set song list -->
            <template v-else-if="set.songs">
              <b-list-group class="songlist column-wrapper">
                <b-list-group-item v-for="(song, index) in set.songs" :key="song">
                  {{index+1}} - {{songs[song].name}}
                </b-list-group-item>
              </b-list-group>
            </template>
          </b-collapse>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from 'axios'

export default {
  name: "Setlist",

  props: ["setIndex"],

  data() {
    return {
      isExpanded: false,
    };
  },

  computed: {
    ...mapState(["setlists", "selectedArtist", "user", "songs"]),
    set() {
      return this.setlists[this.setIndex];
    },
  },

  methods: {
    ...mapMutations(['updateSetlist', 'setSpotifyPreview']),
    openSongSelctPanel() {
      const songSelctPanel = this.$showPanel({
        component : 'song-select',
        cssClass: 'songlistPanel',
        disableBgClick: true,
        props: {
          setIndex: this.setIndex
        }
      })
      songSelctPanel.promise
        .then(set => {
          if (set) {
            this.updateSetlist({
              setIndex: this.setIndex,
              set: set,
            });
            this.createPlaylist()
          }
        })
        .catch(error => {
          this.makeErrorToast(`Something went wrong!\n${error}`);
        })
    },
    async createPlaylist() {
      let res = await get('api/spotify/create_playlist/', {
        params: {
          user: this.user.id,
          songs: this.set.spotifyUris,
          name: this.set.playlistName,
          description: this.set.playlistDescription,
          visibility: this.set.playlistVisibility
        }
      });
      if (res.error) {
        this.makeErrorToast('Can\'t create playlist at this time');
        return;
      }
      
      const spotifyPreview = { html: `<iframe src="https://open.spotify.com/embed/playlist/${res.data.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>` };
      this.setSpotifyPreview({
        setIndex: this.setIndex,
        spotifyPreview: spotifyPreview,
      });
      if (!this.isExpanded) {
        this.$root.$emit('bv::toggle::collapse', `set-collapse-${this.setIndex}`)
      }
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.setlist-result-row {
  background-color: #f1f1f1;
  padding: 1em;
  padding-bottom: 1em;
  padding-top: 1em;
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
  margin-top: 1em;
  width: 100%;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

.column-wrapper {
  max-height: 400px;
  display: flex;
  flex-flow: column wrap;
}
</style>