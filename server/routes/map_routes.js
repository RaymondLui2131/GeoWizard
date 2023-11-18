const express = require("express")
const router = express.Router()
const { saveUserMap, createMap } = require("../controllers/map_controllers")
router.put("/save", saveUserMap)
module.exports = router