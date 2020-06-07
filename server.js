/* eslint-disable no-console */
'use strict';

const express = require('express');
const path = require('path');
let SpotifyWebApi = require('spotify-web-api-node');
let setlistfmJs = require("setlistfm-js");
require("dotenv").config();

const app = express();
app.use(express.static(path.resolve(path.join(__dirname, "/dist"))));

// Healthcheck endpoint
app.get('/healthcheck/:str', function (req, res) {
  res.json({
    success: true,
    msg: req.params.str
  });
});

// Search Artists based on name
app.get('/api/artist/:artist', function (req, res) {
  let reqObj = {
    artistName: req.params.artist
  };
  
  setlistfmClient.searchArtists(reqObj)
  .then(function(results) {
    res.json(results.artist);
  })
  .catch(function(error) {
    console.log('Something went wrong!', error);
  });
});

// Search Venues based on name
app.get('/api/venue/:venue', function (req, res) {
  let reqObj = {
    name: req.params.venue
  };

  setlistfmClient.searchVenues(reqObj)
  .then(function(results) {
    res.json(results.venue);
  })
  .catch(function(error) {
    console.log('Something went wrong!', error);
  });
});

// Search setlists based on venue and artist ids
app.get('/api/setlist/', function (req, res) {
  let reqObj = {
    artistMbid: req.query.artistId,
    venueId: req.query.venueId,
  };

  setlistfmClient.searchSetlists(reqObj)
  .then(function(results) {
    res.json(results.setlist);
  })
  .catch(function(error) {
    console.log('Something went wrong!', error);
  });
});

// Search track given track name + artists name
app.get('/api/track/', function (req, res) {
  // const track = encodeURI(req.query.track);
  // const artist = encodeURI(req.query.artist);
  const track = req.query.track;
  const artist = req.query.artist;
  spotifyApi.searchTracks("track:" + track + " artist:" + artist).then(
    function(data) {
      res.send(data.body);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

// SetlistFM client
const setlistfmClient = new setlistfmJs({
  key: process.env.SETLISTFM_KEY,
  format: "json",
});
// 

// Spotify client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
// 

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});