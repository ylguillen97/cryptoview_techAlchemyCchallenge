const express = require("express");
const { getNFTMetadata } = require("../controllers/nftController");
const router = express.Router();

router.post("/metadata", getNFTMetadata);

module.exports = router;
