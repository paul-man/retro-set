# Pit People

Find setlists from passed concerts and turn them into spotify playlists!

_____

## SetListFM API

Using this API we are able to search for venues and music artists and show a list of all songs they've played there before.

Once we have this, we can separate the lists into the music arists' different performance dates at the venue in the correct order they were played.

## Spotify API

Once we have the music artist and the setlist of song names, we can attempt to search Spotify for the songs and add them to a playlist.

_____

## Develop locally

#### Prerequisites:
- setlistfm API key [[create an account](https://www.setlist.fm/signup), [apply for api key](https://www.setlist.fm/settings/api)]
- Spotify API key [[quickstart guide](https://developer.spotify.com/documentation/web-api/quick-start/)]
- Create `.env` file and add keys/secrets:
    ````
    SETLISTFM_KEY={}
    SPOTIFY_CLIENT_ID={}
    SPOTIFY_CLIENT_SECRET={}
    ````

#### To run

1. `npm install`
2. Run vue dev server - `npm run dev-vue`
3. Open another terminal and run node dev server - `npm run dev-node`

_Note: Currently this project is not ready to run in a production environment_
_____

TODO:

- [ ] Allow user to double check results of Spotify Track Search, showing all options letting the user pick and choose how to handle duplicate matches
- [ ] Render each setlist out separately, displaying relevant concert date information (date, tour name, supporting artists, sold out, # of songs, etc.)
  - [ ] Add button to each setlist letting user pick that to search spotify for (eventually change this to checkboxes for creating multiple playlists at a time)
