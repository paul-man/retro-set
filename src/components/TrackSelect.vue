<template>
  <div id="track-select" :key="componentKey" ref="trackSelect">
    <b-container class="rounded" id="playlist-header">
      <p
        class="d-inline-block d-none d-md-block d-sm-block spotify-user-id">
        Playlist for 
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
            <td class="col-sm-8 match-col">
              <template v-if="typeof song.matches === 'undefined'">
                <div>
                  <b-spinner label="Loading..."></b-spinner>
                </div>
              </template>
              <template v-else>
                <b-row>
                  <b-col sm="12">
                    <div v-if="song.matches.length === 0" class="no-match-warn">
                      <p>
                        No matches found for "{{ song.name }}" by
                        {{ selectedArtist.name }}. Search for a replacement track or add it later at position
                        {{ songIndex + 1 }}.
                      </p>
                      <p>
                        Checkout the
                        <a :href="set.url" target="_blank">setlist</a> for more
                        information
                      </p>
                    </div>
                    <div
                      v-else
                      :class="'container matches-wrapper' + (song.matches.length > 1 ? ' shadow rounded multiple' : '')">
                      <div
                        class="row match-div"
                        v-for="(match, matchIndex) in song.matches"
                        :key="matchIndex">
                        {{ setDefaultMatch(song, match.uri, matchIndex) }}
                        <b-form-radio
                          variant="primary"
                          v-model="song.selectedUri"
                          :value="match.uri"
                          :name="'match-' + songIndex"/>
                        <p style="float: left;">
                          <img
                            :src="getAlbumImg(match.albumImageUrl)"
                            class="img-md"/>
                        </p>
                        <div
                          class="float-right match-desc"
                          style="text-align:left;">
                          <p>
                            <span class="bold">Title:</span> {{ match.songTitle}}
                          </p>
                          <p>
                            <span class="bold">Artist:</span> {{ match.artistName}}
                          </p>
                          <p>
                            <span class="bold">Album:</span> {{ match.albumTitle }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-button
                      size="sm"
                      class="mb-2 add-song-btn"
                      title="Search Spotify for song"
                      @click="openTrackSearchModal(song)">
                      <b-icon icon="music-note" aria-hidden="true"></b-icon>+
                    </b-button>  
                  </b-col>
                </b-row>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal
      no-close-on-backdrop
      hide-footer
      id="spotify-search-modal"
      title="Search a track"
      size="lg">
      <spotify-track-search />
    </b-modal>
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
import SpotifyTrackSearch from "@/components/SpotifyTrackSearch";
import { mapState } from "vuex";
import { get } from "axios";

export default {
  name: "track-select",
  components: {
    SpotifyTrackSearch,
  },
  props: ["set"],
  data() {
    return {
      componentKey: 0,
      trackSearchError: false,
      trackSearchErrorCode: null,
    };
  },

  async mounted() {
    this.set.playlistName = "";
    this.set.playlistVisibility = "private";
    this.set.playlistDescription = "";
    for (let song of this.set.songs) {
      this.trackSearch(song);
    }
    if (this.trackSearchError) {
      this.makeErrorToast(this.respCodes[this.trackSearchErrorCode]);
    }
    this.forceRerender();
  },

  computed: {
    ...mapState(["selectedArtist", "selectedVenue", "respCodes", "user"]),
    defaultPlaylistName() {
      return (
        this.selectedArtist.name + " - " + this.selectedVenue.name + " (" + this.set.eventDate + ")"
      );
    },
  },

  methods: {
    async trackSearch(song) {
      song.matches = [];
      get("api/spotify/track/", {
        params: {
          track: song.name,
          artist: this.selectedArtist.name,
        },
      }).then( result => {
        if (!result.data.error) {
          song.matches = result.data
          this.forceRerender()
        } else {
          this.trackSearchError = true;
          this.trackSearchErrorCode = result.data.status;
        }
      }).catch( error => {
        this.makeErrorToast(error);
      });
    },
    setDefaultMatch(song, uri, index) {
      if (index === 0) {
        song.selectedUri = uri;
      }
    },
    refreshSetlists() {
      this.set.spotifyUris = [];
      for (let song of this.set.songs) {
        if (song.selectedUri) {
          this.set.spotifyUris.push(song.selectedUri);
        }
      }

      if (this.set.playlistName === "")
        this.set.playlistName = this.defaultPlaylistName;
      this.$emit("closePanel", this.set);
    },
    openTrackSearchModal(song) {
      this.$store.commit("setCurrentSongToSearch", song.name);
      this.$store.commit("setCurrentSong", song);
      this.$bvModal.show("spotify-search-modal");
    },
    closePanel() {
      this.$emit("closePanel", null);
    },
    forceRerender() {
      this.componentKey += 1;
      console.log(this.componentKey)
    },
    makeToast(msg) {
      this.$bvToast.toast(msg, {
        title: "Uh oh!",
        variant: "warning",
        solid: true,
      });
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

.add-song-btn {
  margin-top: 0.5em;
  background-color: $retro-green;
  color: #2156D9;
  border: 0;
}

.match-desc {
  overflow-x: auto;
  white-space: nowrap;
  display: inline-block;
}
.match-desc > p {
  float: none;
  margin-bottom: 0;
}

div.row,
tr.row {
  margin-right: 0;
  margin-left: 0;
}

.jsonView {
  text-align: left;
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

.spinner-border {
  color: #00e286;
}

.matches-wrapper {
  padding-left: 0;
}

.matches-wrapper.multiple {
  border-right: solid 1px #e9e9e9;
  border-bottom: solid 1px #e9e9e9;
}

.match-div {
  padding-left: 0.5em;
  padding-top: 0.2em;
}

.matches-wrapper img {
  margin-right: 15px;
}

.no-match-warn {
  background-color: #fab0862d;
  border: 2px solid #fab086;
  border-radius: 5px;
  padding: 5px 0px 1px 7px;
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
</style>
