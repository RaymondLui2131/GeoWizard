const express = require("express")
const router = express.Router()
const { postComment, getComment } = require("../controllers/comment_controllers")
router.post("/addComment", postComment)
router.get("/getComment", getComment)
module.exports = router