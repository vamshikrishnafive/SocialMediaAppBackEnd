const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

//incoming imports
const Post = require("../models/post")

//exports
exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("postedBy")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .exec((err, post) => {
            if(err || !post) {
                return res.status(400).json({
                    error:err
                })
            }
            req.post = post
            next()
        })
}
exports.getPosts = (req,res) => {
    const posts =  Post.find()
        .populate("postedBy")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .select("_id title body created likes")
        .sort({created: -1})
        .then(posts => {
            res.json(posts)
            // console.log(posts)
        })
        .catch(err => {
            console.log(err)
        })
}
exports.createPost = (req,res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded."
            })
        }
        let post = new Post(fields)

        req.profile.hashed_password = undefined
        req.profile.salt = undefined
        post.postedBy = req.profile
        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if(err){
                res.status(400).json({
                    error:err
                })
            }
            res.json(result)
            next()
        })
    })
}
exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select("_id title body created likes")
        .sort('_created')
        .exec((err, posts) => {
            if(err) {
                return res.status(400).json({
                    error:err
                })
            }
            res.json(posts)
        })
}
exports.isPoster = (req, res, next) => {
    let isPosted = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPosted){
        return res.status(403).json({error:"User is not authorized"})
    }
    next()
}
exports.updatePost = (req, res, next) => {
    let from = new formidable.IncomingForm();
    from.keepExtensions = true
    from.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error:err
            })
        }
        let post = req.post
        console.log(post)
        post = _.extend(post, fields)
        post.updated = Date.now()

        if(files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if(err){
                res.status(400).json({
                    error:err
                })
            }
            // console.log(post)
            res.json(post);
        })
    })
}
exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json({
            message:"Post deleted successfully"
        })
    })
}
exports.photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}
exports.singlePost = (req, res) => {
    let post = req.post;
    res.json(post)
}
//like
exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, 
        { $push: { likes: req.body.userId } }, 
        { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: "WORNGS"
                });
            } else {
                res.status(200).json(result);
            }
        }
    )
}
//unlike
exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, 
        { $pull: { likes: req.body.userId } }, 
        { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.status(200).json(result);
            }
        }
    );
};
exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId
    Post.findByIdAndUpdate(req.body.postId, 
        {$push:{comments: comment}}, 
        {new: true}
        ).populate("comments.postedBy","_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.status(200).json(result);
            }
        })
}
exports.uncomment = (req, res) => {
    let comment = req.body.comment;
    Post.findByIdAndUpdate(req.body.postId, 
        {$pull :{comments: { _id : comment._id }}}, 
        {new: true}
        ).populate("comments.postedBy","_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.status(200).json(result);
            }
        })
}
exports.updatecomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, {$push:{comments: comment}}, {new: true})
        .exec((err) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            } else {
               Post.findByIdAndUpdate(
                   req.body.postId,
                   { $push : {commens: comment, updated: new Date() }},
                   {new : true}
               )
                .populate("comments.postedBy","_id name")
                .populate("postedBy", "_id name")
                .exec((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        res.status(200).json(result);
                    }
                })
            }
        })
}