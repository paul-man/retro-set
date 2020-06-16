const api = require('./api')
let mongoUtil = require('./mongoUtil');

mongoUtil.connectToServer( function(err) {
  if (err) { console.log(err); }
  else {
    console.log('MONGO CONNECTED');
    return;
  }
});

module.exports = app => {
  app.use('/api', api)
}