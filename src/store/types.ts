
export interface RootState {
  version: string;

  // TODO: Create actual types and replace these
  user: PlaceholderType;
  setlists: PlaceholderType;
  songs: Array<PlaceholderType>;
  selectedArtist: PlaceholderType;
  selectedVenue: PlaceholderType;
  currentSongName: string;
  currentSong: PlaceholderType;
}

export type PlaceholderType = Record<string, any>
