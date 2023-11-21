const express = require("express")
const router = express.Router()
const { saveUserMap, createMap, getMap, queryMaps, changeLikesMap } = require("../controllers/map_controllers")
const { verifyToken } = require("../jwt_middleware")
router.put("/save", verifyToken, saveUserMap)
router.get("/getMap", getMap)
router.get("/queryMaps", queryMaps)
router.put("/changeLikesMap", changeLikesMap)
module.exports = router