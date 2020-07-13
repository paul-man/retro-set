<template>
  <b-container class="shadow-lg rounded" id="search">

    <!-- Dev test button row -->
    <b-row v-if="isDev()">
      <b-col>
        <div class="float-right">
          <b-button variant="secondary" @click="testSetlistSearch" id="test-btn">
            <b-icon icon="lightning-fill"></b-icon>
          </b-button>
        </div>
      </b-col>
    </b-row>

    <!-- Search fields row -->
    <b-row>
      <b-col lg="6"><artist-search /></b-col>
      <b-col lg="6"><venue-search /></b-col>
    </b-row>

    <!-- Search text row -->
    <b-row v-if="readyToSearchSetlists">
      <b-col>
        <h3>
          <a class="action" :href="selectedArtist.url" target="_blank">
            {{selectedArtist.name}}
          </a> has played at <a class="action" :href="selectedVenue.url" target="_blank">
            {{selectedVenue.name}}
          </a> {{setlists.length}} time{{ setlists.length > 1 ? "s" : "" }}
        </h3>
      </b-col>
    </b-row>

    <!-- Search instructions row -->
    <b-row v-else>
      <b-col>
        <h3>
          Begin by searching for an <u>artist</u> and <u>venue</u>
        </h3>
      </b-col>
    </b-row>

    <!-- Setlists data row -->
    <b-row v-if="setlists">
      <b-col>
        <setlist-container />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import VenueSearch from "@/components/VenueSearch";
import ArtistSearch from "@/components/ArtistSearch";
import SetlistContainer from "@/components/setlist/SetlistContainer";
import { get } from 'axios'

export default {
  name: "search",
  components: {
    VenueSearch,
    ArtistSearch,
    SetlistContainer,
  },

  mounted() {
    let query = Object.assign({}, this.$route.query);
    delete query.user;
    this.$router.replace({ query });
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState(['selectedVenue', 'selectedArtist', 'setlists', 'testdata', 'user']),
    readyToSearchSetlists() {
      return (
        this.$store.getters.selectedVenue.id !== undefined && this.$store.getters.selectedArtist.mbid !== undefined
      );
    }
  },

  methods: {
    async testSetlistSearch() {
      this.$store.commit("setSelectedArtist", this.testdata.ARTIST);
      this.$store.commit("setSelectedVenue", this.testdata.VENUE);
    },
    async getSetlists() {
      let setlists = await get("api/setlists/setlist/", {
        params: {
          artistId: this.selectedArtist.mbid,
          venueId: this.selectedVenue.id
        }
      });
      if (setlists.error) {
        this.makeErrorToast('Having trouble finding those setlists, please try searching again')
        return
      }
      this.$store.commit("setSetlists", setlists.data);
    }
  },

  watch: {
    readyToSearchSetlists: function(ready) {
      if (ready) {
        this.getSetlists();
      }
    },
    selectedArtist: function() {
      if (this.selectedVenue.id !== undefined) {
        this.getSetlists();
      }
    },
    selectedVenue: function() {
      if (this.selectedArtist.mbid !== undefined) {
        this.getSetlists();
      }
    }
  }
};
</script>

<style lang="scss">
#search {
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #f1f1f1;
  border: solid 1px lightgray;
  min-height: 50vh;
}
</style>
