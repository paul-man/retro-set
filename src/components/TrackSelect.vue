<template>
  <div id="track-select" :key="componentKey">
    <div class="form-group row">
      <label for="playlistNameField" class="col-sm-2 col-form-label bold">Playlist Name</label>
      <div class="col-sm-5">
        <input v-model="set.playlistName" type="text" class="form-control" id="playlistNameField" :placeholder="defaultPlaylistName">
      </div>
    </div>
    <table class="table table-striped table-bordered table-sm" id="matches-table">
      <thead class="thead-dark">
        <tr class="row">
          <th class="col-sm-1">#</th>
          <th class="col-sm-4">Song</th>
          <th class="col-sm-7">Spotify Matches</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, songIndex) in set.songs" :key="songIndex" class="row">
          <th class="col-sm-1">{{ songIndex + 1 }}</th>
          <td class="col-sm-4" style="color: #008d55; font-size:16px;">{{ song.name }}</td>
          <td class="col-sm-7" style="padding-left: 1em;">
            <template v-if="!song.matches">
              <div>
                <b-spinner label="Loading..."></b-spinner>
              </div>
            </template>
            <template v-else>
              <template v-if="song.matches.length === 0">
                <div class="no-match-warn">
                  <p>There were no matches found for "{{song.name}}" by {{selectedArtist.name}}, sorry :/</p>
                  <p>Currently, you'll have to add the song yourself (at position {{songIndex+1}}), but in the future you'll be able to browse the artist's Spotify discogrophy right here!</p>
                </div>
              </template>
              <template v-else>
                <div :class="'container matches-wrapper' + (song.matches.length > 1 ? ' shadow rounded multiple' : '')">
                  <div class="row match-div" v-for="(match, matchIndex) in song.matches" :key="matchIndex">
                    {{ setDefaultMatch(song, match.uri, matchIndex) }}
                    <b-form-radio variant="primary" v-model="song.selectedUri" :value="match.uri" :name="'match-' + songIndex"/>
                    <p style="float: left;">
                      <img :src="match.albumImageUrl" height="64px" width="64px" border="1px" />
                    </p>
                    <div class="float-right" style="text-align:left;">
                      <p>
                        <span class="bold">Title:</span> {{ match.songTitle }}<br/>
                        <span class="bold">Album:</span> {{ match.albumTitle }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <pre class="jsonView">{{ set | stringify }}</pre><br> -->
    <div class="panel-footer">
      <b-button variant="warning" @click="closePanel">Cancel</b-button>
      <b-button variant="primary" @click="refreshSetlists">Save changes</b-button>
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
    this.set.playlistName = '';
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
      
      if (this.set.playlistName === '') this.set.playlistName = this.defaultPlaylistName;
      this.$emit("closePanel", this.set)
    },
    closePanel() {
      this.$emit("closePanel", null)
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
  padding-top: 1em;
  padding-bottom: 1em;
  background-color: #e9e9e9
}

.spinner-border {
color: #00e286;
}

.matches-wrapper.multiple {
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

.no-match-warn {
  background-color: #ff9a5f8a;
}
</style>
