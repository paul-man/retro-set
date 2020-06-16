require("dotenv").config();
let { MongoClient } = require("mongodb");
const mongoURI = process.env.MONGODB_URI;

let _db, spotifyCollection;

let mongoUtil = {
  connectToServer: function(callback) {
    MongoClient.connect(
      mongoURI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, client) {
        _db = client.db("users");
        spotifyCollection = _db.collection("spotifyData");
        return callback(err);
      }
    );
  },

  getUserData: async function(userID) {
    console.log(`MONGO: getting user data (${userID})`);
    let result = await spotifyCollection.findOne({
      id: userID,
    });
    console.log(result);
    return result;
  },

  setUserData: async function(userData) {
    // console.log(`MONGO: setting user data (${JSON.stringify(userData)})`);
    let result = await spotifyCollection.findOne({
      id: userData.id,
    });
    if (result) {
      // user already existed, update data
      spotifyCollection.updateOne(
        {
          id: userData.id,
        },
        { $set: userData }
      );
    } else {
      spotifyCollection.insertOne(userData);
    }
  },
};

module.exports = mongoUtil;
