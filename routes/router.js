const express = require("express"),
  router = express.Router();

router.use("/api/setlists", require("./setlists"));
router.use("/api/spotify", require("./spotify"));

module.exports = router;
