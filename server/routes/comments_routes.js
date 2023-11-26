const express = require("express")
const router = express.Router()
const { postComment, getComment, changeLikesComment, getUserComments } = require("../controllers/comment_controllers")
router.post("/addComment", postComment)
router.get("/getComment", getComment)
router.put('/changeLikesComment', changeLikesComment)
router.post("/getUserComments", getUserComments)
module.exports = router