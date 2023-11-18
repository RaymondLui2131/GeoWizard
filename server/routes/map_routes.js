const express = require("express")
const router = express.Router()
const { saveUserMap, createMap,getMap } = require("../controllers/map_controllers")
router.put("/save", saveUserMap)
router.get("/getMap", getMap)
module.exports = router