const express = require("express")
const router = express.Router()
const { postComment, getComment, changeLikesComment } = require("../controllers/comment_controllers")
router.post("/addComment", postComment)
router.get("/getComment", getComment)
router.put('/changeLikesComment', changeLikesComment)
module.exports = router