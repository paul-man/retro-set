/* eslint-disable no-console */
const SpotifyWebApi = require("spotify-web-api-node"),
  mongoUtil = require('./mongoUtil');

class SpotifyUtil {
  constructor(){
   if(! SpotifyUtil.instance){
     this.api = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_CALLBACK_URL,
    });
     SpotifyUtil.instance = this;
   }

   return SpotifyUtil.instance;
  }

  spotifyApi()  {
    return this.api
  }

  flattenSongMatches(songs)  {
    let matches = [];
    for (let item of songs.items) {
      const artistName = item.artists.map((artist) => artist.name).join(", ");
      if (item.album.images.length === 0) {
        item.album.images.push({ url: "" });
      }

      let newMatch = {
        songTitle: item.name,
        artistName: artistName,
        albumTitle: item.album.name,
        albumImageUrl: item.album.images[0].url,
        id: item.id,
        uri: item.uri,
      };
      matches.push(newMatch);
    }
    return matches;
  }

  async searchArtist(artist) {
    try {
      await this.setGenericAccessToken();
      const artistResult = await this.api.searchArtists(artist, { limit: 1 });
      const images = artistResult.body.artists.items[0].images;
      const len = images.length;
      return images[len - 1].url;
    } catch {
      return "";
    }
  }

  // Return user data
  remove_user()  {
    this.api.resetAccessToken();
    this.api.resetRefreshToken();
  }

  async setAccessToken(userId)  {
    if (userId) {
      const user = await mongoUtil.getUserData(userId);
      this.api.setAccessToken(user.accessToken);
      this.api.setRefreshToken(user.refreshToken);
    }
  }

  /* Retrieve an access token
   *  Useful when searchig, or other tasks not requiring user login
   */
  async setGenericAccessToken()  {
    if (this.api.getAccessToken()) {
      return;
    }
    try {
      let spotifyApiData = await this.api.clientCredentialsGrant();
      this.api.setAccessToken(spotifyApiData.body.access_token);
    } catch (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }
  }

  refreshAccessToken()  {
    // set user's refresh token
    this.api.refreshAccessToken().then(
      function(data) {
        console.log("The access token has been refreshed!");

        // Save the access token so that it's used in future calls
        this.api.setAccessToken(data.body["access_token"]);
      },
      function(err) {
        console.log("Could not refresh access token", err);
      }
    );
  }
}

const spotifyUtil = new SpotifyUtil();
Object.freeze(spotifyUtil);

module.exports = spotifyUtil;
