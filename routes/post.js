const express = require("express")
const fs = require("fs")
const router = express.Router()

//incoming imports
const {getPosts, createPost, postsByUser,
        postById, isPoster, deletePost, 
        updatePost, photo, singlePost,
        like, unlike, comment, 
        uncomment, updatecomment} = require("../controllers/post")
const { createPostValidator } = require("../validator")
const { requireSignin } = require("../controllers/auth")
const { userById } = require("../controllers/user")

//homeRoute
router.get("/posts",getPosts)
//like & unlike
router.put("/post/like", requireSignin, like)
router.put("/post/unlike", requireSignin, unlike)
//comment, uncomment, update.
router.put("/post/comment", requireSignin, comment)
router.put("/post/uncomment", requireSignin, uncomment)
router.put("/post/updatecomment", requireSignin, updatecomment)
//post routes
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator)
router.get("/posts/by/:userId", requireSignin , postsByUser)
router.get('/post/:postId', singlePost)
router.put("/post/:postId", requireSignin, isPoster, updatePost)
router.delete("/post/:postId", requireSignin, isPoster, deletePost)
//photo
router.get("/post/photo/:postId",photo)
//params
router.param("userId", userById) //any route containing :userId, our app will first execute userBy()
router.param("postId", postById) //any route containing :postId, our app will first execute postId()

//exports
module.exports  = router

