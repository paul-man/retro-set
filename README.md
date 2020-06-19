# RetroSet

Find setlists from past concerts and turn them into spotify playlists!

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
    SPOTIFY_CALLBACK_URL=http://localhost:8080/api/spotify/callback
    LOGIN_REDIRECT_URL=http://localhost:8080
    MONGODB_URI=mongodb://mongodb0.example.com:27017
    DATABASE_NAME=user
    ````

#### To run

1. `git clone https://github.com/paul-man/retro-set.git && cd retro-set`
1. `npm install`
1. Run dev server - `npm run dev`

_Note: Currently this project is not ready to run in a production environment_
_____

[TODO](./TODO.md)
