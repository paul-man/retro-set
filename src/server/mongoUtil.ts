let { MongoClient } = require("mongodb");
const mongoURI = process.env.MONGODB_URI;
const db_name = process.env.DATABASE_NAME || 'users';
let _db, spotifyCollection;

let mongoUtil = {
  connectToServer: function(callback) {
    MongoClient.connect(
      mongoURI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, client) {
        if (err) {
          return callback(err);
        }
        _db = client.db(db_name);
        spotifyCollection = _db.collection("spotifyData");
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
