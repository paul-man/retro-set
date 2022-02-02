import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // declare your own store states
  // TODO: Create custom types for these
  interface State {
    user: Record<string, any>,
    setlists: Record<string, any>,
    songs: Record<string, any>,
    selectedArtist: Record<string, any>,
    selectedVenue: Record<string, any>,
    currentSongName: string,
    currentSong: Record<string, any>,
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}