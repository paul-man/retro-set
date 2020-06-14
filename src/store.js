import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {},
    selectedArtist: {},
    selectedVenue: {},
    setlists: [],
    testdata: {
      ARTIST: {
        mbid: "9311e2bc-bb3f-44cf-90d8-b1fe6912b60b",
        name: "Brand New",
        sortName: "Brand New",
        disambiguation: "US alternative rock",
        url: "https://www.setlist.fm/setlists/brand-new-4bd69b82.html",
      },
      VENUE: {
        id: "4bd7e35a",
        name: "The Paramount",
        city: {
          id: "5121636",
          name: "Huntington",
          state: "New York",
          stateCode: "NY",
          coords: {
            lat: 40.868154,
            long: -73.425676,
          },
          country: {
            code: "US",
            name: "United States",
          },
        },
        url:
          "https://www.setlist.fm/venue/the-paramount-huntington-ny-usa-4bd7e35a.html",
      },
    },
  },
  getters: {
    selectedArtist: (state) => {
      return state.selectedArtist;
    },
    selectedVenue: (state) => {
      return state.selectedVenue;
    },
    setlists: (state) => {
      return state.setlists;
    },
    testdata: (state) => {
      return state.testdata;
    },
    isUserLoaded: (state) => {
      return Object.keys(state.user).length !== 0;
    },
  },
  mutations: {
    setSelectedArtist(state, payload) {
      Vue.set(state, "selectedArtist", JSON.parse(JSON.stringify(payload)));
    },
    setSelectedVenue(state, payload) {
      Vue.set(state, "selectedVenue", JSON.parse(JSON.stringify(payload)));
    },
    setSetlists(state, payload) {
      Vue.set(state, "setlists", JSON.parse(JSON.stringify(payload)));
    },
    setUser(state, payload) {
      Vue.set(state, "user", JSON.parse(JSON.stringify(payload)));
    },
  },
  actions: {},
});

export default store;