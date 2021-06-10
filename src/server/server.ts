/* eslint-disable no-console */
"use strict";

const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN || '' });

const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 8080,
  { resolve } = require("path"),
  configureAPI = require('./configure');

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// API
configureAPI(app);

// UI
const publicPath = resolve(__dirname, '../../dist');
app.use(express.static(publicPath));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
