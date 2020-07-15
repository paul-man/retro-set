<template>
  <b-container
    class="rounded"
    id="setlist-search-form">
    
    <!-- Search instructions row -->
    <b-row>
      <b-col>
        <h4>
          Begin by searching for an <u>artist</u> or <u>venue</u>
        </h4>
      </b-col>
    </b-row>

    <!-- Row (Artist + Venue) -->
    <b-row align-h="center">

      <!-- Artist -->
      <b-col 
        md="12"
        lg="6">
        <artist-search />
      </b-col>

      <!-- Venue -->
      <b-col 
        md="12"
        lg="6">
        <venue-search />
      </b-col>
    </b-row>    

    <!-- Search by date -->
    <b-row
      class="mt-1 mb-1"
      align-h="start">
      <b-col
        lg="2"
        md="3">
        <b-form-checkbox
          class="date-checkbx"
          v-model="includeDate"
          size="lg">
          Search by date
        </b-form-checkbox>
      </b-col>

      <template v-if="includeDate"
        id="date-info-collapse">
          <b-col
            lg="1"
            md="12">
            <toggle-button
              v-model="searchByDate"
              :width="70"
              :height="30"
              :font-size="14"
              :labels="{checked: 'Date', unchecked: 'Year'}"/>
          </b-col>

          <b-col
            v-if="!searchByDate"
            lg="3"
            md="12">
            <b-form-input
              class="year-input"
              min="1900"
              :max="currentYear"
              v-model="year"
              placeholder="Concert year"
              :formatter="validateYear"
              :disabled="searchByDate"></b-form-input>
          </b-col>
          
          <!-- Date Picker -->
          <b-col
            v-if="searchByDate"
            lg="3"
            md="12">
            <b-form-datepicker
              v-model="date"
              id="concert-datepicker"
              placeholder="Concert date" class="mb-2"
              :disabled="!searchByDate"></b-form-datepicker>
          </b-col>
      </template>
    </b-row>



    <b-row
      class="mt-4 mb-4"
      align-h="end">
      <b-col
        lg="2">
        <b-button @click="search">
          <b-icon
            class="search-btn"
            icon="search" 
            aria-hidden="true"></b-icon>
        </b-button>
      </b-col>
    </b-row>

    <!-- TODO: Maybe add this as a post search filter -->
    <!-- Row (Country / State + City) -->
    <!-- <b-row>
      <b-col></b-col>
    </b-row> -->

  </b-container>
</template>

<script>
import { get } from 'axios';
import { mapState } from 'vuex'
import VenueSearch from "@/components/VenueSearch";
import ArtistSearch from "@/components/ArtistSearch";
import { ToggleButton } from 'vue-js-toggle-button';

export default {
  name: "SetlistSearchForm",

  components: {
    VenueSearch,
    ArtistSearch,
    ToggleButton,
  },

  data() {
    return {
      searchByDate: false,
      year: '',
      date: '',
      includeDate: false
    }
  },

  computed: {
    ...mapState(['selectedArtist', 'selectedVenue']),
    searchDate() {
      if (this.date) {
        const date = this.date.split('-');
        return `${date[2]}-${date[1]}-${date[0]}`;
      }
      return '';
    },
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    async search() {
      if (typeof this.selectedArtist.id === 'undefined' && typeof this.selectedVenue.id === 'undefined') {
        this.makeWarningToast('Please select an artist and/or venue');
        return;
      }
      let searchData = {
        params: {
        }
      };

      if (this.selectedArtist.id) {
        searchData.params['artistId'] = this.selectedArtist.id;
      }
      if (this.selectedVenue.id) {
        searchData.params['venueId'] = this.selectedVenue.id;
      }
      if (this.searchByDate && this.searchDate.length > 0) {
        searchData.params['date'] = this.searchDate
      } else if (this.year > 0){
        searchData.params['year'] = this.year;
      }
      
      let setlists = await get("api/setlists/setlist/", searchData);
      if (setlists.error) {
        this.makeErrorToast('Having trouble finding those setlists, please try searching again')
        return
      }
      
      this.$store.commit("setSetlists", setlists.data);
    },
    validateYear(value) {
      const len = value.length;
      if (len === 0) {
        return '';
      }
      
      if (len === 2) {
        if (value !== "19" && value !== "20") {
          return value.slice(0, -1); 
        }
      }

      // if is not not a number == if is a number
      if (!isNaN(value.charAt(len - 1)) && len <= 4) {
        return value;
      }
      return value.slice(0, -1);
    },
  },

  watch: {
    
  }
}
</script>

<style lang="scss">
#setlist-search-form {
  padding:15px;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-bottom: 2em;
}

.date-info-container {
  padding: 0.5em;
}

.date-info-row {
  padding-top: 0.5em;
}

.b-form-datepicker, .dropdown-menu {
  margin-bottom: 0px !important;
}

.date-checkbx {
  margin-bottom: 1em;
}

.form-title {
  float:left;
}

.search-btn {
  margin-left: 2em;
  margin-right: 2em;
}

.year-input {
  text-align: center;
  margin-bottom: 0.5em;
}

.v-switch-core {
  background-color: $primary !important;
}

.v-switch-label {
  font-weight: normal !important;
}
</style>
