<template>
  <div class="search">
    <div class="container">
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn-primary" @click="testSetlistSearch">Test</button>
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
      <div v-if="readyToSearchSetlists">
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
          <setlist-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    };
  },

  computed: {
    ...mapState(['selectedVenue', 'selectedArtist', 'setlists', 'testdata']),
    readyToSearchSetlists() {
      return (
        this.$store.getters.selectedVenue.id !== undefined && this.$store.getters.selectedArtist.mbid !== undefined
      );
    }
  },

  methods: {
    testSetlistSearch() {
      this.$store.commit("setSelectedArtist", this.testdata.ARTIST);
      this.$store.commit("setSelectedVenue", this.testdata.VENUE);
    },
    async getSetlists() {
      const res = await axios.get("api/setlist/", {
        params: {
          artistId: this.selectedArtist.mbid,
          venueId: this.selectedVenue.id
        }
      });
      let setlists = await res;
      setlists = setlists.data;      

      this.$store.commit("setSetlists", setlists);
    },
  },

  watch: {
    readyToSearchSetlists: function(val) {
      if (val) {
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
