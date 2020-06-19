require("dotenv-flow").config();
const api = require('./api'),
  history = require('connect-history-api-fallback');
let mongoUtil = require('./mongoUtil');

module.exports = app => {
  app.use('/api', api)
  app.use(history())
  
  mongoUtil.connectToServer( function(err) {
    if (err) { console.log(err); }
    else {
      console.log('MONGO CONNECTED');
      return;
    }
  });
}