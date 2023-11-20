const express = require("express")
const router = express.Router()
const { saveUserMap, createMap, getMap, getAllMaps, changeLikesMap } = require("../controllers/map_controllers")
router.put("/save", saveUserMap)
router.get("/getMap", getMap)
router.get("/getAllMaps", getAllMaps)
router.put("/changeLikesMap", changeLikesMap)
module.exports = router