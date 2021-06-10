/* eslint-disable no-console */
const express = require("express"),
      router = express.Router(),
      mongoUtil = require('../mongoUtil'),
      spotifyUtil = require('../spotifyUtil'),
      logger = require('../logger'),
      scopes = ["user-read-email", "playlist-modify-private", "playlist-modify-public"];

const spotifyApi = spotifyUtil.spotifyApi();

// Spotify login endpoint
router.get("/login/", function(req, res) {
  let spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes);
  if (req.query.newUser) {
    spotifyUtil.remove_user()
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
      // LOL
      imgUrl: (spotifyUserData.body.images
          && spotifyUserData.body.images[0]
          && spotifyUserData.body.images[0].url)
          || '',
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
    logger.error(err);
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
  await spotifyUtil.setGenericAccessToken();
  const song = req.query.song;
  const artist = req.query.artist;
  spotifyApi.searchTracks("track:" + song + " artist:" + artist).then(
    function(data) {
      let songs = spotifyUtil.flattenSongMatches(data.body.tracks);
      res.send(songs);
    },
    function(err) {
      logger.error(err);
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
        logger.error(err);
        res.send({
          error: true,
          status: 513,
          errorMsg: err});
      });
  })
  .catch((err) => {
    logger.error(err);
    res.send({
      error: true,
      status: 512,
      errorMsg: err});
  });
});

module.exports = router;
