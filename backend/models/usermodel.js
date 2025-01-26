const mongoose= require('mongoose')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastlogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
},{timestamps:true})
// { timestamps: true } option in Mongoose is used to automatically add two fields, createdAt and updatedAt, to your documents whenever they are created or modified
const User = mongoose.model('User',userSchema)

module.exports= User;