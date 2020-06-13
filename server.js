/* eslint-disable no-console */
"use strict";

const express = require("express");
const path = require("path");
let SpotifyWebApi = require("spotify-web-api-node");
let setlistfmJs = require("setlistfm-js");
require("dotenv").config();
let moment = require("moment");
let user_data = "";
const app = express();
app.use(express.static(path.resolve(path.join(__dirname, "/dist"))));
// Healthcheck endpoint
app.get("/healthcheck/:str", function(req, res) {
  res.json({
    success: true,
    msg: req.params.str,
  });
});

// Search Artists based on name
app.get("/api/artist/:artist", function(req, res) {
  let reqObj = {
    artistName: req.params.artist,
  };

  setlistfmClient
    .searchArtists(reqObj)
    .then(function(results) {
      let artists = results.artist;
      for (let artist of artists) {
        delete artist.sortName;
      }
      res.json(results.artist);
    })
    .catch(function(error) {
      console.log("Something went wrong!", error);
    });
});

// Search Venues based on name
app.get("/api/venue/:venue", function(req, res) {
  let reqObj = {
    name: req.params.venue,
  };

  setlistfmClient
    .searchVenues(reqObj)
    .then(function(results) {
      res.json(results.venue);
    })
    .catch(function(error) {
      console.log("Something went wrong!", error);
    });
});

// Search setlists based on venue and artist ids
app.get("/api/setlist/", function(req, res) {
  let reqObj = {
    artistMbid: req.query.artistId,
    venueId: req.query.venueId,
  };

  setlistfmClient
    .searchSetlists(reqObj)
    .then(function(results) {
      let setlists = flattenSetlists(results.setlist);
      
      res.json(setlists);
    })
    .catch(function(error) {
      console.log("Something went wrong!", error);
    });
});
// Flatten setlist data, return relevant data
let flattenSetlists = (setlists) => {
  let newSetlistArr = [];
  for (let setlist of setlists) {
    let newSetlist = {
      songs: [],
      id: setlist.id,
      url: setlist.url,
      eventDate: moment(setlist.eventDate, "DD-MM-YYYY").format("MMM D, YYYY"),
    };
    
    for (let subset of setlist.sets.set) {
      for (let song of subset.song) {
        newSetlist.songs.push({
          name: song.name
        });
      }
    }
    newSetlistArr.push(newSetlist);
  }
  return newSetlistArr;
};

// Search track given track name + artists name
app.get("/api/track/", function(req, res) {
  // const track = encodeURI(req.query.track);
  // const artist = encodeURI(req.query.artist);
  const track = req.query.track;
  const artist = req.query.artist;
  spotifyApi.searchTracks("track:" + track + " artist:" + artist).then(
    function(data) {
      let tracks = flattenTrackMatches(data.body.tracks);

      res.send(tracks);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});
// Flatten Spotify data for track results
let flattenTrackMatches = (tracks) => {
  let matches = [];
  for (let item of tracks.items) {
    let newMatch = {
      songTitle: item.name,
      albumTitle: item.album.name,
      albumImageUrl: item.album.images[0].url,
      id: item.id,
      uri: item.uri
    };
    matches.push(newMatch);
  }
  return matches;
};

let scopes = ["user-read-email", "playlist-modify-private"];
let user = {};

// Search track given track name + artists name
app.get("/api/spotify/login/", function(req, res) {
 var spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes);
//  res.redirect(spotifyAuthUrl);
//  var html = spotifyApi.createAuthorizeURL(scopes);
//  //  console.log(html);
 res.send(spotifyAuthUrl);  
});

// Search track given track name + artists name
app.get("/api/spotify/callback/", async function(req, res) {
 const { code } = req.query;
 user.token = code;
 
  try {
    var data = await spotifyApi.authorizationCodeGrant(code)
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    let userRes = await spotifyApi.getMe();
    user.data = userRes.body;
    console.log(user.data)
    user.data = {
      id: userRes.body.id,
      imgUrl: userRes.body.images[0].url,
    };
    res.redirect(`http://localhost:8080/?user=${JSON.stringify(user.data)}`);
  } catch(err) {
    res.redirect('/#/error/invalid token');
  }
});

app.get("/api/spotify/create_playlist/", async function(req, res) {
  console.log('CREATING NEW PLAYLIST')
  console.log(user.id)
  console.log(user.data.id);
  spotifyApi.createPlaylist(user.data.id, req.query.playlistName, {
    public: false
  }).then(data => {
    console.log(data);
    let playlist = data.body;
    spotifyApi.addTracksToPlaylist(playlist.id, req.query.songs)
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  }).catch(err => {
    console.log(err);
  });
});


// addTracksToPlaylist;
/*
redirect uris:
http://localhost:8081/api/spotify/callback 
http://localhost:8080/search 
*/



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
  redirectUri: process.env.SPOTIFY_CALLBACK_URL,
});
// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body.access_token);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);
//

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
