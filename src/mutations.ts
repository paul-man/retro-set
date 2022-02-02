import { MutationType } from './store/mutations'
import { State } from './store/state'
import { PlaceholderType } from './store/types'

export type Mutations = {
  [MutationType.SetSelectedArtist](state: State, artist: PlaceholderType): void
  [MutationType.SetSelectedVenue](state: State, venue: PlaceholderType): void
  [MutationType.SetSetlists](state: State, setlists: PlaceholderType[]): void
  [MutationType.SetUser](state: State, user: PlaceholderType): void
  [MutationType.SetCurrentSongName](state: State, songName: string): void
  [MutationType.SetCurrentSong](state: State, song: PlaceholderType): void
  [MutationType.SetSongMatches](state: State, matches: PlaceholderType[]): void
  [MutationType.AddSongMatch](state: State, match: PlaceholderType): void
  [MutationType.SetSetlistSpotifyURIs](state: State, uris: string[]): void
  [MutationType.UpdateSetlist](state: State, setlist: PlaceholderType): void
  [MutationType.SetSpotifyPreview](state: State, preview: PlaceholderType): void
  [MutationType.AddSongs](state: State, songs: Array<PlaceholderType>): void
}