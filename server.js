'use strict';

const express = require('express');
const path = require('path');
let SpotifyWebApi = require('spotify-web-api-node');
let setlistfmJs = require("setlistfm-js");
const https = require('https');
const app = express();
require('dotenv').config();

let setlistfmClient = new setlistfmJs({
	key: process.env.SETLISTFM_KEY,
	format: "json",
});

app.use(express.static(path.resolve(path.join(__dirname, '/dist'))));

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

app.get('/api/track/', function (req, res) {

  // Do search using the access token
  spotifyApi.searchTracks('track:' + req.query.track + ' artist:' + req.query.artist).then(
    function (data) {
      res.send(data.body);
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );
  // res.send(data.body);
});

var clientId = process.env.SPOTIFY_CLIENT_ID,
  clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
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

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});