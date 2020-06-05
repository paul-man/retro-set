<template>
  <div class="search">
    <div class="container">
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn-primary" @click="testSpotify">Test</button>
        </div>
      </div>
      <div v-if="validSelection">
        <div class="row">
          <div class="col">
            <p>
              {{this.$store.getters.selectedArtist.name}} has played at {{this.$store.getters.selectedVenue.name}}
              {{this.$store.getters.setlists.length}} time(s)
            </p>
            <p>Here are Spotify Previews of each of the song they've played there (this can be very sloooooow...)</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <venue-search />
        </div>
        <div class="col">
          <artist-search />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <setlist-view />
        </div>
      </div>
    </div>
    <ul>
      <li v-for="template in templates" v-bind:key="template">
        <div v-html="template.html"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import VenueSearch from "@/components/VenueSearch";
import ArtistSearch from "@/components/ArtistSearch";
import SetlistView from "@/components/SetlistView";
import axios from "axios";

export default {
  name: "search",
  components: {
    VenueSearch,
    ArtistSearch,
    SetlistView
  },

  data() {
    return {
      playedSongs: [],
      setlists: this.$store.getters.setlists,
      spotifyResp: [],
      templates: []
    };
  },

  computed: {
    validSelection() {
      return (
        this.$store.getters.selectedVenue.id !== "" &&
        this.$store.getters.selectedArtist.id !== ""
      );
    }
  },

  methods: {
    testSpotify() {
      this.$store.commit("setSelectedArtist", {
        artistId: "9311e2bc-bb3f-44cf-90d8-b1fe6912b60b",
        artistName: "Brand New"
      });
      this.$store.commit("setSelectedVenue", {
        venueId: "4bd7e35a",
        venueName: "The Paramount"
      });
    },
    async getSetlists() {
      const res = await axios.get("api/setlist/", {
        params: {
          artistId: this.$store.getters.selectedArtist.id,
          venueId: this.$store.getters.selectedVenue.id
        }
      });
      let setlists = await res;
      setlists = JSON.parse(JSON.stringify(setlists.data));
      this.$store.commit("setSetlists", setlists);

      return;
      this.playedSongs = this._processSetlists(setlists.data);
      await this.trackSearch(this._processSetlists([setlists.data[0]]));
    },
    async trackSearch(tracks) {
      for (let track of tracks) {
        const res = await axios.get("api/track/", {
          params: {
            track: track,
            artist: this.$store.getters.selectedArtist.name
          }
        });
        let resp = await res;
        this.spotifyResp.push(resp.data.tracks);
      }

      this._proccessTracks(this.spotifyResp);
    },
    _proccessTracks(tracks) {
      let trackUriArr = [];
      for (let resp of tracks) {
        if (resp.items.length === 0) continue;
        for (let item of resp.items) {
          trackUriArr.push(item.uri);
        }
      }
      this.createSongPreviews(trackUriArr);
    },
    createSongPreviews(trackUris) {
      for (let uri of trackUris) {
        uri = uri.split(":")[2];
        let src = `https://open.spotify.com/embed/track/${uri}`;
        this.templates.push({
          html: `<iframe src="${src}" width="300" height="200" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
        });
      }
    },
    _processSetlists(setlists) {
      let allSongs = [];
      for (let set of setlists) {
        for (let subset of set.sets.set) {
          for (let song of subset.song) {
            if (allSongs.indexOf(song.name) === -1) {
              allSongs.push(song.name);
            }
          }
        }
      }
      return allSongs;
    }
  },

  watch: {
    validSelection: function(newVal) {
      if (newVal) {
        this.getSetlists();
      }
    }
  }
};
</script>

<style lang="scss">
.search {
  padding-top: 20px;
}

.map-container {
  padding-top: 20px;
}
</style>
