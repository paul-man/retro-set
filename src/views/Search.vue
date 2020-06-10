<template>
  <div class="search">
    <div class="container shadow-lg rounded">
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn-secondary" id="test-btn" @click="testSetlistSearch">
            <img src="@/assets/zap.svg" class="icon-svg"/>
          </button>
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
            <h3>
              <a :href="selectedArtist.url" target="_blank">{{selectedArtist.name}}</a> has played at <a :href="selectedVenue.url" target="_blank">{{selectedVenue.name}}</a> {{setlists.length}} time{{ setlists.length > 1 ? "s" : "" }}
            </h3>
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
      let setlists = await axios.get("api/setlist/", {
        params: {
          artistId: this.selectedArtist.mbid,
          venueId: this.selectedVenue.id
        }
      });

      this.$store.commit("setSetlists", setlists.data);
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

.search > div.container {
  padding-top: 20px;
  background-color: #f1f1f1;
  border: solid 1px lightgray;
}

.map-container {
  padding-top: 20px;
}

#test-btn {
  position: absolute;
  right: 5px;
  top: -15px;
}
</style>
