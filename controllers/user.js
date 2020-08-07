const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

//incoming imports
const User = require("../models/user");
const { result } = require("lodash");
const user = require("../models/user");

//exports
exports.userById = (req, res, next, id) => {
    User.findById(id)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
        if(err || !user){
            return res.status(400).json({error:"User not found"})
        }
        req.profile = user // adds profile object in req with user info
        next()
    })
}
exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if(!authorized){
        return res.status(403).json({error:"User is not authorized to perform this action."})
    }
    next()
}
exports.allUsers = (req, res) => {
    User.find((err, user) => {
        if(err){
            return res.status(400).json({error: err})
        }
        res.json(user)
    })
    .select("name email updated created")
}
exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}
// exports.updatedUser = (req, res, next) => {
//     let user = req.profile
//     user = _.extend(user, req.body)
//     user.updated = Date.now()
//     user.save((err) => {
//         if(err){
//             return res.status(400).json({error:"You are not authorized to perform this action."})
//         }
//         user.hashed_password = undefined
//         user.salt = undefined
//         return res.json({user})
//     })
// }
exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(403).json({error:'Photo could not  upload '})
        }
        //update user
        let user = req.profile
        user = _.extend(user, fields)
        user.updated = Date.now()
        // console.log(user.files)
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        // save
        user.save((err, result) => {
            if(err){
                res.status(400).json({error:err})
            }
            // console.log(result)
            user.hashed_password = undefined
            user.salt = undefined
            return res.json(user)
        })
    
    })
}
//profilePhoto
exports.userPhoto = (req, res, next) => {
    if(req.profile.photo.data) {
        res.set(("Content-Type", req.profile.photo.contentType))
        return res.send(req.profile.photo.data);
    }
    next()
}
//deleteProfile
exports.deleteUser = (req, res) => {
    let user = req.profile
    user.remove((err) => {
        if(err){
            return res.status(400).json({error:err})
        }
        return res.json({message:"User deleted sucessfuly"})
    })
}
//followwing
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId,
        {$push:{following:req.body.followId}},
        (err) => {
        if(err) {
             res.status(400).json({error:err})
        }
        next();
    })
    }
//followers     
exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId,
        {$push:{followers:req.body.userId}},
        {$new: true})
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({error:err})
            }
            result.hashed_password = undefined
            result.salt = undefined
            res.json(result)
        })
    }
//unfollowing
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId,
        {$pull:{following:req.body.unfollowId}},
        (err) => {
        if(err) {
             res.status(400).json({error:err})
        }
        next();
    })
    }
//unfollowers     
exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId,
        {$pull:{followers:req.body.userId}},
        {$new: true})
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({error:err  })
            }
            // console.log(result)
            result.hashed_password = undefined
            result.salt = undefined
            res.json(result)
        })
}
//find people
exports.findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id)
    User.find({ _id: { $nin: following } }, (err, users) => {
        if(err) {
            res.status.json({error:err})
        }
        // console.log(users)
        res.json(users)
    }).select('name')
}
