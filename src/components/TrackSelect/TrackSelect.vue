<template>
  <div id="track-select">
    <b-container class="rounded" id="playlist-header">
      <p
        class="d-inline-block d-none d-md-block d-sm-block spotify-user-id">
        New playlist for 
        <a
          :href="'https://open.spotify.com/user/' + user.id"
          target="_blank">
            {{ user.id }}
          </a>
      </p>
    </b-container>
    <div id="playlist-data-wrapper">
      <b-container id="playlist-form">
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="2"
          label="Playlist Name"
          label-for="playlist-name"
          maxLength="100">
          <b-form-input
            v-model="set.playlistName"
            :placeholder="defaultPlaylistName"
            id="playlist-name"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="2"
          label="Playlist Description"
          label-for="playlist-description"
          maxLength="300">
          <b-form-textarea
            id="playlist-description"
            v-model="set.playlistDescription"
            placeholder="Add a description for your playlist"
            rows="3"
            max-rows="6"/>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="2"
          label="Playlist Visibility">
          <b-form-radio
            v-model="set.playlistVisibility"
            name="playlist-visibility"
            value="private"
            checked
            ><b-icon icon="lock"></b-icon> Private
          </b-form-radio>
          <b-form-radio
            v-model="set.playlistVisibility"
            name="playlist-visibility"
            value="public"
            ><b-icon icon="unlock"></b-icon> Public
          </b-form-radio>
        </b-form-group>
      </b-container>
      <b-container id="search-btn-desc">
        Use 
        <b-button
          size="sm"
          class="mb-2 add-song-btn">
          <b-icon icon="music-note" aria-hidden="true"></b-icon>+
        </b-button> 
        to search and add more song matches
      </b-container>
      <table
        class="table table-striped table-bordered table-sm"
        id="matches-table">
        <thead class="thead-dark">
          <tr class="row">
            <th class="col-sm-1">#</th>
            <th class="col-sm-3">Song</th>
            <th class="col-sm-8">Spotify Matches</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(song, songIndex) in set.songs"
            :key="songIndex"
            class="row">
            <td class="col-sm-1">{{ songIndex + 1 }}</td>
            <td class="col-sm-3 song-name" style="font-size:16px;">
              {{ song.name }}
            </td>
            <td class="col-sm-8">
              <b-row>
                <b-col class="match-col" sm="12">
                  <match-container
                    :setIndex="setIndex"
                    :songIndex="songIndex"/>
                </b-col>
              </b-row>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer rounded">
      <b-button @click="closePanel" size="sm">Cancel</b-button>
      <b-button
        variant="primary"
        @click="refreshSetlists"
        id="create-playlist-btn"
        size="sm">
        Create Playlist <i class="fa fa-spotify"></i>
      </b-button>
    </div>
  </div>
</template>

<script>
import MatchContainer from "@/components/TrackSelect/MatchContainer";
import { mapState } from "vuex";

export default {
  name: "track-select",

  components: {
    MatchContainer,
  },

  props: ["setIndex"],

  data() {
    return {
      spotifyUrisPayload: {},
    };
  },

  mounted() {
    this.set.playlistName = "";
    this.set.playlistVisibility = "private";
    this.set.playlistDescription = "";
    this.spotifyUrisPayload = {
      setIndex: this.setIndex,
      spotifyUris: [],
    }
  },

  computed: {
    ...mapState(["selectedArtist", "selectedVenue", "user", "setlists"]),
    defaultPlaylistName() {
      return (
        this.selectedArtist.name + " - " + this.selectedVenue.name + " (" + this.set.eventDate + ")"
      );
    },
    set() {
      return this.$store.getters.setlists[this.setIndex];
    }
  },

  methods: {
    refreshSetlists() {
      // debugger
      this.spotifyUrisPayload.spotifyUris = [];
      this.$store.commit('setSetlistSpotifyURIs', this.spotifyUrisPayload);
      let tempSpotifyUris = []
      for (let song of this.set.songs) {
        if (song.selectedUri) {
          tempSpotifyUris.push(song.selectedUri);
        }
      }
      
      this.spotifyUrisPayload.spotifyUris = tempSpotifyUris;
      this.$store.commit('setSetlistSpotifyURIs', this.spotifyUrisPayload);
      if (this.set.playlistName === "") {
        this.set.playlistName = this.defaultPlaylistName;
      }
      this.$emit("closePanel", this.set);
    },
    closePanel() {
      this.$emit("closePanel", null);
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
#track-select {
  height: 100%;
  text-align: left;
}

.add-match-btn-div {
  position: absolute;
  right: 1em;
  top: 1em;
}

#spotify-search-modal {
  z-index: 1022 !important;
}

div.row,
tr.row {
  margin-right: 0;
  margin-left: 0;
}

h5 {
  margin-bottom: 0 !important;
}

.form-check {
  padding-top: 22px;
}

.form-group.row {
  padding-top: 1em;
  padding-bottom: 1em;
  background-color: #e9e9e9;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

#playlist-form {
  padding-top: 1em;
  margin: 0;
}

#playlist-data-wrapper {
  max-height: 90%;
  overflow-y: scroll;
}

#playlist-header {
  background-color: #e9e9e994;
  max-height: 5%;
  max-width: 100% !important;
  padding: 5px 0px 5px 5px;
  margin: 0;
}

.panel-footer button {
  margin-right: 10px;
  margin-left: 10px;
}

.panel-footer {
  padding-right: 25px;
  padding-top: 2px;
  text-align: right;
  background-color: #e9e9e994;
  height: 5%;
}

#search-btn-desc {
  text-align: center;
  border-top: 1px solid rgba(211, 211, 211, 0.301);
}

#search-btn-desc button {
  pointer-events: none;
}

.spotify-user-id {
  font-size: large;
}

.match-col {
  padding: 0;
}
</style>
