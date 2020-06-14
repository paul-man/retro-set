<template>
  <div id="track-select" :key="componentKey">
    <div class="form-group row">
      <label for="playlistNameField" class="col-sm-2 col-form-label bold">Playlist Name</label>
      <div class="col-sm-5">
        <input v-model="playlistName" type="text" class="form-control" id="playlistNameField" :placeholder="defaultPlaylistName">
      </div>
    </div>
    <table class="table table-striped table-bordered table-sm" id="matches-table">
      <thead class="thead-dark">
        <tr>
          <th scope="col" class="col-sm-1">#</th>
          <th scope="col" class="col-sm-4">Song</th>
          <th scope="col" class="col-sm-7">Spotify Matches</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, songIndex) in set.songs" :key="songIndex">
          <th class="col-sm-1" scope="row">{{ songIndex + 1 }}</th>
          <td class="col-sm-4">{{ song.name }}</td>
          <td class="col-sm-7">
            <template v-if="!song.matches">
              <div class="spinner-border" style="color: #00e286" role="status">
              </div>
            </template>
            <template v-else>
              <div :class="'container matches-wrapper' + (song.matches.length > 1 ? ' shadow rounded multiple' : '')">
                <div class="row match-div" v-for="(match, matchIndex) in song.matches" :key="matchIndex">
                  <div class="form-check">
                    <input type="radio" class="form-check-input" :value="match.uri" :name="'match-' + songIndex" :checked="song.matches.length === 1" :disabled="song.matches.length === 1"/>
                  </div>
                  <p style="float: left;">
                    <img :src="match.albumImageUrl" height="64px" width="64px" border="1px" />
                  </p>
                  <p style="text-align: left;">
                    <span class="bold">Title:</span> {{ match.songTitle }}<br/>
                    <span class="bold">Album:</span> {{ match.albumTitle }}
                  </p>
                </div>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <pre class="jsonView">{{ set | stringify }}</pre><br> -->
    <div class="panel-footer">
        <button type="button" class="btn btn-warning" @click="closePanel">Cancel</button>
        <button type="button" class="btn btn-primary" @click="refreshSetlists">Save changes</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get } from 'axios'

export default {
  name: "track-select",
  props: ["set"],
  data() {
    return {
      componentKey: 0,
      playlistName: '',
    };
  },

  computed: {
    ...mapState(["selectedArtist", "selectedVenue"]),
    defaultPlaylistName() {
      return this.selectedArtist.name + ' - ' + this.selectedVenue.name + ' (' + this.set.eventDate + ')';
    }
  },

  async mounted() {
    for (let song of this.set.songs) {
      let matches = await this.trackSearch(song);
      song.matches = matches
    }
    this.forceRerender()
  },

  methods: {
    async trackSearch(song) {
      song.matches = [];
      const res = await get("api/spotify/track/", {
        params: {
          track: song.name,
          artist: this.selectedArtist.name,
        },
      });
      let spotifyResp = await res;
      return spotifyResp.data;
    },
    refreshSetlists() {
      let selectedSongInputs = document.querySelectorAll('input[name*="match-"]:checked');
      this.set.spotifyUris = [];
      for (let input of selectedSongInputs) {
        this.set.spotifyUris.push(input.value);
      }
      
      if (this.playlistName === '') this.playlistName = this.defaultPlaylistName;
      this.set.playlistName = this.playlistName;
      this.$emit("closePanel", this.set)
    },
    closePanel() {
      this.$emit("closePanel", {})
    },
    forceRerender() {
      this.componentKey += 1;  
    }
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.jsonView {
  text-align: left;
}

.form-check {
  padding-top: 22px;
}

.form-group.row {
  // margin-top: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  background-color: #e9e9e9
}

// Add border between mutliple song matches
// .match-div:not(:last-child) {
//   border-bottom: solid 1px gray;
// }

.matches-wrapper.multiple {
  // border: solid 1px rgb(199, 199, 199);
  border: solid 1px #e9e9e9;
}

.match-div {
  padding: 5px;
}

.match-div p {
  margin: 0;
}

.matches-wrapper img {
  margin-right: 15px;
}
.panel-footer button {
  margin: 10px;
}

.panel-footer {
  margin-bottom: 25px;
  margin-right: 25px;
  margin-top: 25px;
  text-align: right;
}
</style>
