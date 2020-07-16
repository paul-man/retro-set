import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { stateMerge } from "vue-object-merge";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {},
    setlists: {},
    songs: {},
    selectedArtist: {},
    selectedVenue: {},
    currentSongName: "",
    currentSong: {},
    respCodes: {
      "512": "Unable to create playlist",
      "513": "Unable to add song(s) to playlist",
      "514": "Unable to authenticate with Spotify",
      "515": "Something went wrong with SetlistFM",
      "516": "Something went wrong with Spotify",
      "517": "Unable to retrieve Spotify user data",
      "518": "Having trouble searching Spotify for songs. Try refreshing the page and logging back in"
    },
    testdata: {
      ARTIST: {
        id: "9311e2bc-bb3f-44cf-90d8-b1fe6912b60b",
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
      testSong: {"songTitle":"Cheeky Song (Touch My Bum)","artistName":"The Cheeky Girls","albumTitle":"Party Time","albumImageUrl":"https://i.scdn.co/image/ab67616d0000b273787f8022645548615a346154","id":"6MCovnA5m16hln36lk0gqM","uri":"spotify:song:6MCovnA5m16hln36lk0gqM"}
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
    respCodes: (state) => {
      return state.respCodes;
    },
    currentSongName: (state) => {
      return state.currentSongName;
    },
    currentSong: (state) => {
      return state.currentSong;
    },
    songs: (state) => {
      return state.songs;
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
    setCurrentSongName(state, payload) {
      Vue.set(state, "currentSongName", payload);
    },
    setCurrentSong(state, payload) {
      Vue.set(state, "currentSong", payload);
    },
    setSongMatches(state, payload) {
      let songID = state.setlists[payload.setIndex].songs[payload.songIndex];
      Vue.set(state.songs[songID], 'matches', payload.matches);
    },
    addSongMatch(state, payload) {
      let songID = state.setlists[payload.setIndex].songs[payload.songIndex];
      const matchesLength = state.songs[songID].matches.length;
      Vue.set(state.songs[songID].matches, matchesLength, payload.song);
    },
    setSetlistSpotifyURIs(state, payload) {
      Vue.set(state.setlists[payload.setIndex], 'spotifyUris', payload.spotifyUris);
    },
    updateSetlist(state, payload) {
      Vue.set(state.setlists[payload.setIndex], payload.set);
    },
    setSpotifyPreview(state, payload) {
      Vue.set(state.setlists[payload.setIndex], 'spotifyPreview', payload.spotifyPreview);
    },
    addSongs(state, payload) {
      stateMerge(state, payload, 'songs');
    },
  },
  actions: {},
  plugins: [createPersistedState({
    paths: ['user'],
    storage: window.sessionStorage,
  })],
});

export default store;