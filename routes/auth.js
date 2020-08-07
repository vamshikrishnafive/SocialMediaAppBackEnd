const express = require("express")
const router = express.Router()

//incoming imports
const { signup, signin, signout, socialLogin, forgotPassword, resetPassword } = require("../controllers/auth")
const { userSignupValidator, userSigninValidator, passwordResetValidator } = require("../validator")
const { userById } = require("../controllers/user")     

//routes
router.post("/signup",userSignupValidator,signup)
router.post("/signin",userSigninValidator, signin)
router.get("/signout",signout)

//ForgotPassword and Reset
router.put("/forgotpassword", forgotPassword)
router.put("/resetpassword", passwordResetValidator, resetPassword)

//socail-login
router.post("/sociallogin", socialLogin)

//params
router.param("userId", userById) //any route containing :userId, our app will first execute userBy()

//exports
module.exports = router