/* eslint-disable no-console */
"use strict";

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
