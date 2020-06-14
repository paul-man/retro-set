const express = require("express"),
  router = express.Router();
let SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

let scopes = ["user-read-email", "playlist-modify-private"];
let user = {};

// Search track given track name + artists name
router.get("/login/", function(req, res) {
  var spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes);
  res.send(spotifyAuthUrl);
});

// Search track given track name + artists name
router.get("/callback/", async function(req, res) {
  const { code } = req.query;
  user.token = code;

  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    let userRes = await spotifyApi.getMe();
    user.data = {
      id: userRes.body.id,
      imgUrl: userRes.body.images[0].url,
    };
    res.redirect(`http://localhost:8080/?user=${JSON.stringify(user.data)}`);
  } catch (err) {
    res.redirect('/spotify-error');
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
    res.redirect("/spotify-error");
    }
  );
});

router.put("/create_playlist/", async function(req, res) {
  spotifyApi
    .createPlaylist(user.data.id, req.query.playlistName, {
      public: false,
    }, )
    .then((data) => {
      let playlist = data.body;
      spotifyApi
        .addTracksToPlaylist(playlist.id, req.query.songs)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(data);
          res.redirect('/spotify-error')
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/spotify-error");
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
