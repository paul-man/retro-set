import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {
  selectedArtist: {
    id: '',
    name: ''
  },
  selectedVenue: {
    id: '',
    name: ''
  },
  setlists: [],
 },
 getters: {
  selectedArtist: state => {
    return state.selectedArtist;
  },
  selectedVenue: state => {
    return state.selectedVenue;
  },
  setlists: state => {
    return state.setlists;
  },
 },
 mutations: {
  setSelectedArtist (state, payload) {
    state.selectedArtist.id = payload.artistId;
    state.selectedArtist.name = payload.artistName;
  },
  setSelectedVenue (state, payload) {
    state.selectedVenue.id = payload.venueId;
    state.selectedVenue.name = payload.venueName;
  },
  setSetlists (state, payload) {
    Vue.set(state, 'setlists', payload);
  }
 },
 actions: {}
});