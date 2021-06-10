const express = require("express"),
  router = express.Router();

router.use("/setlists", require("./routes/setlists"));
router.use("/spotify", require("./routes/spotify"));

module.exports = router;
