const express = require("express")
const router = express.Router()
const { saveUserMap, createMap, getMap, getAllMaps } = require("../controllers/map_controllers")
router.put("/save", saveUserMap)
router.get("/getMap", getMap)
router.get("/getAllMaps", getAllMaps)
module.exports = router