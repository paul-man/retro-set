/* eslint-disable no-console */
"use strict";

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://3f6a94636953494c9d12ab520e693cbc@o409962.ingest.sentry.io/5283409' });

const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 8080,
  { resolve } = require("path"),
  configureAPI = require('./configure');

// API
configureAPI(app);

// UI
const publicPath = resolve(__dirname, '../../dist');
app.use(express.static(publicPath));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
