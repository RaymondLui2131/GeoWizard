const express = require("express")
const router = express.Router()
const { saveUserMap, createMap,getMap, changeLikesMap} = require("../controllers/map_controllers")
router.put("/save", saveUserMap)
router.get("/getMap", getMap)
router.put("/changeLikesMap", changeLikesMap)
module.exports = router