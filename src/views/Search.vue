<template>
  <b-container class="shadow-lg rounded" id="search">

    <!-- Dev test button row -->
    <b-row v-if="false && isDev()">
      <b-col>
        <div class="float-right">
          <b-button variant="secondary" @click="testSetlistSearch" id="test-btn">
            <b-icon icon="lightning-fill"></b-icon>
          </b-button>
        </div>
      </b-col>
    </b-row>

    <!-- Search fields form -->
    <setlist-search-form/>

    <!-- Search text row -->
    <!-- <b-row v-if="readyToSearchSetlists">
      <b-col>
        <h3>
          <a class="action" :href="selectedArtist.url" target="_blank">
            {{selectedArtist.name}}
          </a> has played at <a class="action" :href="selectedVenue.url" target="_blank">
            {{selectedVenue.name}}
          </a> {{setlists.length}} time{{ setlists.length > 1 ? "s" : "" }}
        </h3>
      </b-col>
    </b-row> -->

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
import { get } from 'axios';
import SetlistSearchForm from "@/components/search/SetlistSearchForm";
import SetlistContainer from "@/components/setlist/SetlistContainer";

export default {
  name: "search",
  components: {
    SetlistSearchForm,
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
