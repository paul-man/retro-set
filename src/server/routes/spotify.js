const express = require("express"),
  router = express.Router();
let SpotifyWebApi = require("spotify-web-api-node");
let mongoUtil = require('../mongoUtil');

const scopes = ["user-read-email", "playlist-modify-private"];
let user = {};
const loginRedirectURL = process.env.LOGIN_REDIRECT_URL;

// Search track given track name + artists name
router.get("/login/", function(req, res) {
  let spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes);
  if (req.query.newUser) {
    remove_user()
    spotifyAuthUrl += "&show_dialog=true";
  }
  res.send(spotifyAuthUrl);
});

// Search track given track name + artists name
router.get("/callback/", async function(req, res) {
  const { code } = req.query;
  user.token = code;

  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token,
      refreshToken = data.body.refresh_token;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    let userRes = await spotifyApi.getMe();
    let user = {
      id: userRes.body.id,
      imgUrl: userRes.body.images[0].url,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    mongoUtil.setUserData(user);
    res.redirect(
      `${loginRedirectURL}/?user=${JSON.stringify({
        id: user.id,
        imgUrl: user.imgUrl
      })}`
    );
  } catch (err) {
    res.redirect(`${loginRedirectURL}/spotify-error`);
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

// Search track given track name + artists name
router.get("/track/", function(req, res) {
  const track = req.query.track;
  const artist = req.query.artist;
  spotifyApi.searchTracks("track:" + track + " artist:" + artist).then(
    function(data) {
      let tracks = flattenTrackMatches(data.body.tracks);

      res.send(tracks);
    },
    function(err) {
      console.log("Something went wrong!", err);
      res.redirect(`${loginRedirectURL}/spotify-error`);
    }
  );
});

router.get("/create_playlist/", async function(req, res) {
  let user = await mongoUtil.getUserData(req.query.user);
  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);

  spotifyApi.createPlaylist(user.id, req.query.playlistName, {
      public: false,
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
        res.redirect(`${loginRedirectURL}/spotify-error`);
      });
  })
  .catch((err) => {
    console.log(err);
    res.redirect(`${loginRedirectURL}/spotify-error`);
  });
});

/* HELPERS ***************************************************************** */

// Flatten Spotify data for track results
let flattenTrackMatches = (tracks) => {
  let matches = [];
  for (let item of tracks.items) {
    let newMatch = {
      songTitle: item.name,
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
  user = {};
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
};

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

/* Retrieve an access token
*  Useful when searchig, or other tasks not requiring user login
*/
// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body.access_token);
//   },
//   function(err) {
//     console.log("Something went wrong when retrieving an access token", err);
//   }
// );
//

module.exports = router;
