const express = require('express')
const router= express.Router()
const { signup, login, logout,verifyemail,forgotpassword,resetpassword ,checkAuth} = require("../controllers/authcontroller")
const verifyToken = require("../middleware/verifyToken")

router.get("/check-auth",verifyToken,checkAuth)
router.post("/signup",signup)
router.post("/login", login)
router.post("/logout",logout)
router.post("/verify-email",verifyemail)
router.post("/forgot-password",forgotpassword)
router.post("/reset-password/:token",resetpassword)

module.exports= router;