// https://soshace.com/building-web-apps-with-vue-3-composition-api-typescript-vuex4-0/
import { MutationTree } from 'vuex'
import { State } from './state'
import { Mutations } from '../mutations'

export enum MutationType {
  SetSelectedArtist = 'SET_SELECTED_ARTIST',
  SetSelectedVenue = 'SET_SELECTED_VENUE',
  SetSetlists = 'SET_SETLISTS',
  SetUser = 'SET_USER',
  SetCurrentSongName = 'SET_CURRENT_SONG_NAME',
  SetCurrentSong = 'SET_CURRENT_SONG',
  SetSongMatches = 'SET_SONG_MATCHES',
  AddSongMatch = 'ADD_SONG_MATCH',
  SetSetlistSpotifyURIs = 'SET_SETLIST_SPOTIFY_URIS',
  UpdateSetlist = 'UPDATE_SETLIST',
  SetSpotifyPreview = 'SET_SPOTIFY_PREVIEW',
  AddSongs = 'ADD_SONGS',
}

// /store/mutation.js
export const mutations: MutationTree<State> & Mutations = {
  [MutationType.SetSelectedArtist](state, artist) {
    state.selectedArtist = artist
  },
  [MutationType.SetSelectedVenue](state, venue) {
    state.selectedVenue = venue
  },
  [MutationType.SetSetlists](state, setlists) {
    state.setlists = setlists
  },
  [MutationType.SetUser](state, user) {
    state.user = user
  },
  [MutationType.SetCurrentSongName](state, songName) {
    state.currentSongName = songName
  },
  [MutationType.SetCurrentSong](state, song) {
    state.currentSong = song
  },
  [MutationType.SetSongMatches](state, matches) {
    state.songs = matches
  },
  [MutationType.AddSongMatch](state, match) {
    state.songs.splice(match, 1)
  },
  [MutationType.SetSetlistSpotifyURIs](state, uris) {
    state.setlists.uris = uris
  },
  [MutationType.UpdateSetlist](state, setlist) {
    state.setlists = setlist
  },
  [MutationType.SetSpotifyPreview](state, preview) {
    state.setlists.preview = preview
  },
  [MutationType.AddSongs](state, songs) {
    state.songs = state.songs.concat(songs)
  },
}