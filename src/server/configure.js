require("dotenv-flow").config();
const api = require('./api')
let mongoUtil = require('./mongoUtil');

module.exports = app => {
  app.use('/api', api)
  
  mongoUtil.connectToServer( function(err) {
    if (err) { console.log(err); }
    else {
      console.log('MONGO CONNECTED');
      return;
    }
  });
}