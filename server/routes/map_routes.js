const express = require("express")
const router = express.Router()
const { saveUserMap } = require("../controllers/map_controllers")
router.put("/save", saveUserMap)
module.exports = router