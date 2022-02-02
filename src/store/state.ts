// TODO: Create and import custom types
export type State = {
  // TODO: Create actual types and replace these
  user: Record<string, any>;
  setlists: Record<string, any>;
  songs: Record<string, any>;
  selectedArtist: Record<string, any>;
  selectedVenue: Record<string, any>;
  currentSongName: string;
  currentSong: Record<string, any>;
}

export const state: State = {
  user: {},
  setlists: {},
  songs: {},
  selectedArtist: {},
  selectedVenue: {},
  currentSongName: "",
  currentSong: {},
};