<template>
  <div id="track-select" :key="componentKey">
    <b-container class="rounded" id="playlist-header">
      <h4>Confirm matches and create playlist</h4>
    </b-container>
    <div id="playlist-data-wrapper">
      <b-container id="playlist-form">
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="2"
          label="Playlist Name"
          label-for="playlist-name"
          maxLength="100"
        >
          <b-form-input 
            v-model="set.playlistName"
            :placeholder="defaultPlaylistName"
            id="playlist-name"></b-form-input>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="2"
          label="Playlist Description"
          label-for="playlist-description"
          maxLength="300"
        >
          <b-form-textarea
            id="playlist-description"
            v-model="set.playlistDescription"
            placeholder="Add a description for your playlist"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group 
          label-cols-sm="4"
          label-cols-lg="2"
          label="Playlist Visibility">
          <b-form-radio v-model="set.playlistVisibility" name="playlist-visibility" value="private" checked><b-icon icon="lock"></b-icon> Private</b-form-radio>
          <b-form-radio v-model="set.playlistVisibility" name="playlist-visibility" value="public"><b-icon icon="unlock"></b-icon> Public</b-form-radio>
        </b-form-group>
      </b-container>
      <table
        class="table table-striped table-bordered table-sm"
        id="matches-table"
      >
        <thead class="thead-dark">
          <tr class="row">
            <th class="col-sm-1">#</th>
            <th class="col-sm-3">Song</th>
            <th class="col-sm-8">Spotify Matches</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(song, songIndex) in set.songs" :key="songIndex" class="row">
            <td class="col-sm-1">{{ songIndex + 1 }}</td>
            <td class="col-sm-3" style="color: #008d55; font-size:16px;">
              {{ song.name }}
            </td>
            <td class="col-sm-8 match-col">
              <template v-if="!song.matches">
                <div>
                  <b-spinner label="Loading..."></b-spinner>
                </div>
              </template>
              <template v-else-if="song.matches.length === 0">
                <div class="no-match-warn">
                  <p>
                    There were no matches found for "{{ song.name }}" by
                    {{ selectedArtist.name }}, sorry :/
                  </p>
                  <p>
                    Currently, you'll have to add the song yourself (at position
                    {{ songIndex + 1 }}), but in the future you'll be able to
                    browse the artist's Spotify discogrophy right here!
                  </p>
                </div>
              </template>
              <template v-else-if="song.matches.warning">
                <p>{{ song.matches.warning }}</p>
              </template>
              <template v-else>
                <div
                  :class="
                    'container matches-wrapper' +
                      (song.matches.length > 1 ? ' shadow rounded multiple' : '')
                  "
                >
                  <div
                    class="row match-div"
                    v-for="(match, matchIndex) in song.matches"
                    :key="matchIndex"
                  >
                    {{ setDefaultMatch(song, match.uri, matchIndex) }}
                    <b-form-radio
                      variant="primary"
                      v-model="song.selectedUri"
                      :value="match.uri"
                      :name="'match-' + songIndex"
                    />
                    <p style="float: left;">
                      <img v-if="match.albumImageUrl !== ''"
                        :src="match.albumImageUrl"
                        height="64px"
                        width="64px"
                        border="1px"
                      />
                      <img v-else
                        src="@/assets/no-album-art.png"
                        height="64px"
                        width="64px"
                        border="1px"
                      />
                    </p>
                    <div class="float-right match-desc" style="text-align:left;">
                      <p>
                        <span class="bold">Title:</span> {{ match.songTitle
                        }}<br />
                        <span class="bold">Album:</span> {{ match.albumTitle }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <pre class="jsonView">{{ set | stringify }}</pre><br> -->
    <div class="panel-footer rounded">
      <b-button variant="warning" @click="closePanel">Cancel</b-button>
      <b-button variant="primary" @click="refreshSetlists"
        >Create Playlist</b-button
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get } from "axios";

export default {
  name: "track-select",
  props: ["set"],
  data() {
    return {
      componentKey: 0,
      trackSearchError: false,
      trackSearchErrorCode: null,
    };
  },

  computed: {
    ...mapState(["selectedArtist", "selectedVenue", "respCodes"]),
    defaultPlaylistName() {
      return (
        this.selectedArtist.name +
        " - " +
        this.selectedVenue.name +
        " (" +
        this.set.eventDate +
        ")"
      );
    },
  },

  async mounted() {
    this.set.playlistName = "";
    this.set.playlistVisibility = "private";
    this.set.playlistDescription = "";
    for (let song of this.set.songs) {
      let matches = await this.trackSearch(song);
      song.matches = matches;
    }
    if (this.trackSearchError) {
      this.makeErrorToast(this.respCodes[this.trackSearchErrorCode]);
    }
    this.forceRerender();
  },

  methods: {
    async trackSearch(song) {
      song.matches = [];
      const spotifyResp = await get("api/spotify/track/", {
        params: {
          track: song.name,
          artist: this.selectedArtist.name,
        },
      });
      if (spotifyResp.data.error) {
        this.trackSearchError = true;
        this.trackSearchErrorCode = spotifyResp.data.status;
        return {
          warning: "Unable to retrieve resutls",
        };
      }
      return spotifyResp.data;
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
    closePanel() {
      this.$emit("closePanel", null);
    },
    forceRerender() {
      this.componentKey += 1;
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
}

.match-desc {
  overflow-x: auto; 
  white-space: nowrap;
  display: inline-block;
}
.match-desc > p {
  display: inline-block; 
  float: none; 
}

div.row, tr.row {
  margin-right: 0;
  margin-left: 0;
}

.jsonView {
  text-align: left;
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
  border: solid 1px #e9e9e9;
}

.match-div {
  padding-left: 0.5em;
  padding-top: 0.2em;
}

.matches-wrapper img {
  margin-right: 15px;
}
.panel-footer button {
  margin-right: 10px;
  margin-left: 10px;
}

.panel-footer {
  padding-right: 25px;
  padding-top: 8px;
  // margin-top: 25px;
  text-align: right;
  background-color: #e9e9e994;
  height: 7%
}

.no-match-warn {
  background-color: #ff9a5f8a;
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
  text-align: left;
  padding-top: 1em;
}

#playlist-data-wrapper{
  max-height: 89%;
  overflow-y: scroll;
}

#playlist-header{
  background-color: #e9e9e994;
  height: 4%;
}
</style>
