/* eslint-disable no-console */
const express = require("express"),
  router = express.Router(),
  scopes = ["user-read-email", "playlist-modify-private", "playlist-modify-public"];
let SpotifyWebApi = require("spotify-web-api-node"),
  mongoUtil = require('../mongoUtil');
const { RewriteFrames } = require("@sentry/integrations");

// Spotify login endpoint
router.get("/login/", function(req, res) {
  let spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes);
  if (req.query.newUser) {
    remove_user()
    spotifyAuthUrl += "&show_dialog=true";
  }
  res.send(spotifyAuthUrl);
});

// Callback called from spotify
router.get("/callback/", async function(req, res) {
  const { code } = req.query;

  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token,
          refreshToken = data.body.refresh_token;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    let spotifyUserData = await spotifyApi.getMe();
    let user = {
      id: spotifyUserData.body.id,
      imgUrl: spotifyUserData.body.images[0].url,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    mongoUtil.setUserData(user);
    res.redirect(
      `/?user=${JSON.stringify({
        id: user.id,
        imgUrl: user.imgUrl
      })}`
    );
  } catch (err) {
    res.redirect(`/spotify-error?status=517`);
  }
});

// Return user data
router.get("/user/:userID", function(req, res) {
  if (!req.params.userID) {
    res.send(null)
  } else {
    res.send(mongoUtil.getUserData(req.params.userID))
  }
});

// Search song given song name + artists name
// Note: Spotify calls songs "track/s" but RetroSet will use "song/s"
router.get("/song/", async function(req, res) {
  await setGenericAccessToken();
  const song = req.query.song;
  const artist = req.query.artist;
  spotifyApi.searchTracks("track:" + song + " artist:" + artist).then(
    function(data) {
      let songs = flattenSongMatches(data.body.tracks);
      res.send(songs);
    },
    function(err) {
      res.send({
        error: true,
        status: 518,
        errorMsg: err
      });
    }
  );
});

router.get("/create_playlist/", async function(req, res) {
  let user = await mongoUtil.getUserData(req.query.user);
  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);

  spotifyApi.createPlaylist(user.id, req.query.name, {
      public: req.query.visibility === "public",
      description: req.query.description || ''
  }, )
  .then((data) => {
    let playlist = data.body;
    spotifyApi.addTracksToPlaylist(playlist.id, req.query.songs)
      .then((data) => {
        data.id = playlist.id
        res.send(data)
      })
      .catch((err) => {
        console.log(err);
        res.send({
          error: true,
          status: 513,
          errorMsg: err});
      });
  })
  .catch((err) => {
    console.log(err);
    res.send({
      error: true,
      status: 512,
      errorMsg: err});
  });
});

/* HELPERS ***************************************************************** */

// Flatten Spotify data for song results
let flattenSongMatches = (songs) => {
  let matches = [];
  for (let item of songs.items) {
    const artistName = item.artists.map(artist => artist.name).join(', ');
    if (item.album.images.length === 0) {
      item.album.images.push({url: ""});
    }
    
    let newMatch = {
      songTitle: item.name,
      artistName: artistName,
      albumTitle: item.album.name,
      albumImageUrl: item.album.images[0].url,
      id: item.id,
      uri: item.uri,
    };
    matches.push(newMatch);
  }
  return matches;
};


// Return user data
let remove_user= () => {
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
};

let setAccessToken = async (userId) => {
  if (userId) {
    const user = await mongoUtil.getUserData(userId);
    spotifyApi.setAccessToken(user.accessToken);
    spotifyApi.setRefreshToken(user.refreshToken);
  }
}

/* Retrieve an access token
*  Useful when searchig, or other tasks not requiring user login
*/
let setGenericAccessToken = async () => {
  if (spotifyApi.getAccessToken()) {
    return;
  }
  try {
    let spotifyApiData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(spotifyApiData.body.access_token);
  } catch (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
}

let refreshAccessToken = () => {
  // set user's refresh token
  spotifyApi.refreshAccessToken().then(
    function(data) {
      console.log('The access token has been refreshed!');
  
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Could not refresh access token', err);
    }
  );
}

/* SPOTIFY API SETUP ******************************************************* */

// Create Spotify client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CALLBACK_URL,
});

module.exports = router;
