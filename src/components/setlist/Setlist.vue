<template>
  <b-container class="shadow-lg single-setlist-container">

    <!-- Set song/playlist preview collapse button -->
    <b-container class="float-right" style="text-align:right; padding-top:1em;">

      <!-- TODO: change this to normal button -->
      <b-navbar-toggle :target="'set-collapse-'+setIndex">
        <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" variant="primary" icon="dash-square"></b-icon>
          <b-icon v-else variant="primary" icon="plus-square"></b-icon>
        </template>
      </b-navbar-toggle>
    </b-container>

    <!-- Set data -->
    <p class="font-weight-bold">
      Artist: <a :href="set.artist.url">{{ set.artist.name }}</a>
    </p>
    <p class="font-weight-bold">
      Venue: <a :href="set.venue.url">{{ set.venue.name }}</a>
    </p>
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
      @click="openSongSelctPanel()">
      Confirm Songs
    </b-button>
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
        <b-list-group class="songlist">
          <b-list-group-item v-for="(songID) in set.songs" :key="songID">
            {{ songs[songID].name }}
          </b-list-group-item>
        </b-list-group>           
      </template>
    </b-collapse>
  </b-container>
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
      return this.$store.getters.setlists[this.setIndex];
    }
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
    }
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.single-setlist-container {
  background-color: #f1f1f1;
  padding: 1em;
  border-radius: 8px;
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
</style>