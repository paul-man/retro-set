<template>
  <div class="search">
    <div class="container shadow-lg rounded">
      <div class="row container">
        <div class="col">
          <div v-if="isDev" class="float-right">
            <b-button variant="secondary" @click="testSetlistSearch" id="test-btn">
              <img src="@/assets/zap.svg" class="icon-svg"/>
            </b-button>
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
import { get } from 'axios'

export default {
  name: "search",
  components: {
    VenueSearch,
    ArtistSearch,
    SetlistView
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
    },
    isDev() {
      return process.env.NODE_ENV === 'development'
    }
  },

  methods: {
    async testSetlistSearch() {
      this.$store.commit("setSelectedArtist", this.testdata.ARTIST);
      this.$store.commit("setSelectedVenue", this.testdata.VENUE);
      // let res = await get("api/spotify/create_playlist");
    },
    async getSetlists() {
      let setlists = await get("api/setlists/setlist/", {
        params: {
          artistId: this.selectedArtist.mbid,
          venueId: this.selectedVenue.id
        }
      });

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
.search {
  padding-top: 20px;
}

.search > div.container {
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #f1f1f1;
  border: solid 1px lightgray;
}

#spotify-user-img {
  height:40px;
  width:40px;
  border-radius: 50%;
  margin-right:1em;
}

.text-center {
  vertical-align: middle;
  height:40px;
  line-height: 40px;
}

#spotify-user-link {
  color: #00b66d;
}

#spotify-user-data a {
  margin-top: 0.5em;
  cursor: pointer;
  text-decoration: underline;
}
</style>
