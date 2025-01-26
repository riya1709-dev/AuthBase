const User= require("../models/usermodel")
const bcrypt= require("bcryptjs")
const crypto = require('crypto')
const generateTokenAndSetCookie= require("../utils/generateTokenAndSetCookie")
const {sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail, sendResetSuccessEmail}= require("../mailtrap/email")

const signup= async (req,res)=>{
    const {email, password, name}= req.body
    try{
        if(!email || !password ||!name){
            throw new Error ("All files are required")
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false, message: "User already exists"})
        }
        const hashedPassword= await bcrypt.hash(password.toString(),10)
        const verificationToken= Math.floor(100000 + Math.random() * 900000);
        const user= new User({
            email, 
            password:hashedPassword,
             name,
             verificationToken,
             verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000
            })
            await user.save()

            //jwt
            generateTokenAndSetCookie(res,user._id)

            await sendVerificationEmail(user.email, verificationToken)

            return res.status(201).json({success:true, message: "User created successfully",
                user:{
                    ...user._doc,
                    password: null
                }
            })
    }catch(e){
        return res.status(400).json({success:false, message:e.message})
        }
}

const verifyemail= async (req,res)=>{
    const {code}= req.body;
    try{
        const user = await User.findOne({verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });
        if(!user){
            return res.status(400).json({success:false, message: "Invalid verification token or expired "})
    }
    user.isVerified=true;
    user.verificationToken= undefined;
    user.verificationTokenExpiresAt= undefined;
    await user.save()

    await sendWelcomeEmail(user.email,user.name)
    return res.status(200).json({success:true, message: "Email verified successfully",
        user:{
            ...user._doc,
            password: null,
        }
    })
}catch(e){
    console.log("error i verifyEmail", e)
    return res.status(500).json({success:false, message:e.message})
}
}

const login= async (req,res)=>{
    const {email,password}= req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message: "Invalid email or password "})
    }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({success:false, message: "Invalid email or password "}) 
        }
        generateTokenAndSetCookie(res,user._id)
        user.lastlogin= new Date();
        await user.save()
        return res.status(200).json({success:true, message: "Logged in successfully",
            user:{
                ...user._doc,
                password: null,
            }
        })
    }catch(e){
        console.log("error in login", e)
        res.status(400).json({success:false, messsage:e.message})
}
}
const logout= async (req,res)=>{
    res.clearCookie("token")
    return res.status(200).json({success:true, message: "Logged out successfully"})
}
const forgotpassword= async(req,res)=>{
    const {email}= req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message: "Invalid email "})
        }
        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt= Date.now() + 1*60*60*1000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save()

        //send email
        await sendPasswordResetEmail(user.email,` ${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        return res.status(200).json({success:true, message: "Password reset link send successfully to your email"})
    }catch(e){
        console.log("error in forgotpassword", e)
        res.status(400).json({success:false, messsage:e.message})
    }
}

const resetpassword= async (req,res) => {
    try{
        const {token}= req.params;
        const {password}= req.body;
        const user = await User.findOne({resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}});
            if(!user){
                return res.status(400).json({success:false, message: "Invalid token or expired tok" })
            }
            //update password
            const hashPassword= await bcrypt.hash(password,10)
            user.password = hashPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpiresAt = null;
            await user.save()

            await sendResetSuccessEmail(user.email)
            return res.status(200).json({success:true, message: "Password reset successfully" })
    }catch(e){
        console.log("error in resetpassword", e)
        res.status(400).json({success:false, messsage:e.message})
    }
}
const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
module.exports = {
    signup,
    login,
    logout,
    verifyemail,
    forgotpassword,
    resetpassword,
    checkAuth
};