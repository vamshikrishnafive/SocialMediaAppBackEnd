const mongoose = require("mongoose")
const {v1:uuidv1} = require("uuid")
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema

//Schema
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt : String,
    created: {
        type:Date,
        default:Date.now()
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String,
        trim:true
    },
    following : [{type: ObjectId, ref: "User"}],
    followers : [{type: ObjectId, ref: "User"}],
    updated:Date
})

//virtual field
UserSchema.virtual('password')
    //hash function     
    .set(function(password){
        this._password = password // create a temp variable called password
        this.salt = uuidv1() //gereate a timesparp
        this.hashed_password = this.encryptPassword(password) //encryptedpassword
    })
    .get(function() {
        return this._password
    })

    //methods
    UserSchema.methods = {
        authenticate:function(plainText){
            return this.encryptPassword(plainText) === this.hashed_password
        },

        encryptPassword:function(password){
            if(!password) return ""
            try{    
                return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex')
            } catch(err) {
                return ""
            }
        }
    }

//exports   
module.exports = mongoose.model("User", UserSchema)