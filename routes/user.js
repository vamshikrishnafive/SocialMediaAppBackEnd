const express = require("express")
const router = express.Router()

//incoming imports
const { userById, allUsers, getUser, updateUser, deleteUser, 
        hasAuthorization, userPhoto, addFollowing, addFollower, 
        removeFollowing, removeFollower, findPeople
        } = require("../controllers/user")
const { requireSignin } = require("../controllers/auth")

//follows
router.put('/user/follow', requireSignin, addFollowing, addFollower)

//unfollow
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower)

//routes
router.get("/users", allUsers)
router.get("/user/:userId", requireSignin ,getUser)
router.put("/user/:userId", requireSignin, hasAuthorization ,updateUser)
router.delete("/user/:userId", requireSignin, hasAuthorization ,deleteUser)

//photo
router.get("/user/photo/:userId", userPhoto)

//who to follow
router.get("/user/findpeople/:userId", requireSignin, findPeople)

//params
router.param("userId", userById) //any route containing :userId, our app will first execute userBy()

//exports
module.exports = router