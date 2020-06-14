/* eslint-disable no-console */
"use strict";

const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 8080,
  path = require("path");

app.use(express.static(path.resolve(path.join(__dirname, "/dist"))));

app.use(require("./routes"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
