const express = require("express"),
      router = express.Router(),
      setlistfmJs = require("setlistfm-js"),
      parse = require("date-fns/parse"),
      format = require("date-fns/format"),
      logger = require('../logger'),
      util = require('../util');

// Search Artists based on name
router.get("/artist/:artist", function(req, res) {
  let reqObj = {
    artistName: req.params.artist,
  };

  setlistfmClient
    .searchArtists(reqObj)
    .then(function(results) {
      let artists = results.artist;
      for (let artist of artists) {
        artist['id'] = artist.mbid;
      }
      res.json(results.artist);
    })
    .catch(function(error) {
      logger.error(error);
      res.send({
        error: true,
        status: 519,
        msg: error
      });
    });
});

// Search Venues based on name
router.get("/venue/:venue", function(req, res) {
  let reqObj = {
    name: req.params.venue,
  };

  setlistfmClient
    .searchVenues(reqObj)
    .then(function(results) {
      res.json(results.venue);
    })
    .catch(function(error) {
      logger.error(error);
      res.redirect({
        error: true,
        status: 520,
        msg: error
      });
    });
});

// Search setlists based on venue and artist ids
router.get("/setlist/", function(req, res) {
  let reqObj = {
    artistMbid: req.query.artistId,
    venueId: req.query.venueId,
  };

  if (req.query.year) {
    reqObj['year'] = req.query.year;
  } else if (req.query.date) {
    reqObj['date'] = req.query.date;
  }

  setlistfmClient
    .searchSetlists(reqObj)
    .then(function(results) {
      let {newSetlistArr, songs} = flattenSetlists(results.setlist);

      res.json({
        setlists: newSetlistArr,
        songs: songs
      });
    })
    .catch(function(error) {
      logger.error(error);
      res.redirect({
        error: true,
        status: 521,
        msg: error
      });
    });
});

/* HELPERS ***************************************************************** */

// Flatten setlist data, return relevant data
let flattenSetlists = (setlists) => {
  let newSetlistArr = [];
  let songs = {};
  for (let setlist of setlists) {
    setlist.artist['id'] = setlist.artist.mbid;
    let newSetlist = {
      artist: setlist.artist,
      venue: setlist.venue,
      songs: [],
      id: setlist.id,
      url: setlist.url,
      eventDate: format(
        parse(setlist.eventDate, "dd-MM-yyyy", new Date()),
        "MMMM do, yyyy"
      ),
    };

    for (let subset of setlist.sets.set) {
      for (let song of subset.song) {
        let newSongID = util.newID();
        songs[newSongID] = {
          name: song.name,
        }
        newSetlist.songs.push(newSongID);
      }
    }
    newSetlistArr.push(newSetlist);
  }
  console.log(newSetlistArr.length)
  return { newSetlistArr, songs };
};

/* SETLISTFM API SETUP****************************************************** */

// Create SetlistFM client
const setlistfmClient = new setlistfmJs({
  key: process.env.SETLISTFM_KEY,
  format: "json",
});

module.exports = router;
