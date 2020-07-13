const express = require("express"),
  router = express.Router();
let setlistfmJs = require("setlistfm-js"),
  parse = require("date-fns/parse"),
  format = require("date-fns/format");
const logger = require('../logger');

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
        delete artist.sortName;
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

  setlistfmClient
    .searchSetlists(reqObj)
    .then(function(results) {
      let setlists = flattenSetlists(results.setlist);

      res.json(setlists);
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
  for (let setlist of setlists) {
    let newSetlist = {
      songs: [],
      id: setlist.id,
      url: setlist.url,
      eventDate: format(
        parse(setlist.eventDate, "dd-MM-yyyy", new Date()),
        "MMM do, yyyy"
      ),
    };

    for (let subset of setlist.sets.set) {
      for (let song of subset.song) {
        newSetlist.songs.push({
          name: song.name,
        });
      }
    }
    newSetlistArr.push(newSetlist);
  }
  return newSetlistArr;
};

/* SETLISTFM API SETUP****************************************************** */

// Create SetlistFM client
const setlistfmClient = new setlistfmJs({
  key: process.env.SETLISTFM_KEY,
  format: "json",
});

module.exports = router;
