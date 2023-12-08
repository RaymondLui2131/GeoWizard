/**
 * Router for handling users
 * @author Kahui Wong
 */
const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getUser, googleLoginUser, checkUniqueEmail, checkUniqueUser, getUserById, updateUserInfo, forgotPassword, resetPassword } = require("../controllers/user_controllers")
const { verifyToken, verifyResetToken } = require("../jwt_middleware")
router.post("/register", registerUser)
router.post("/google/login", googleLoginUser)
router.post("/login", loginUser)
router.get("/checkUniqueEmail", checkUniqueEmail)
router.get("/checkUniqueUser", checkUniqueUser)
router.get("/me", verifyToken, getUser)
router.get("/:id", getUserById)
router.put("/updateUserInfo", verifyToken, updateUserInfo)
router.post("/forgotPassword", forgotPassword)
router.put("/resetPassword/:id/:token", verifyResetToken, resetPassword)
module.exports = router