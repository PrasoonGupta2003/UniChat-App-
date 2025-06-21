import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signUp=async (req, res) => {
try{
    const {userName,email,password}=req.body;
    const isUsernameExist=await User.findOne({userName});
    if(isUsernameExist){
         console.log("❌ Username already exists");
        return res.status(400).json({message:"Username alredy exists"});
    }
    const isUseremailExist=await User.findOne({email});
    if(isUseremailExist){
         console.log("❌ Email already exists");
        return res.status(400).json({message:"User email alredy exists"});
    }
    if(password.length<6){
        console.log("❌ Password too short");
        return res.status(400).json({message:"Password must be atleast of 6 character"});
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=await User.create({
        userName: userName,
        email: email,
        password: hashPassword,
    })
    const token =genToken(user._id);

    res.cookie("token",token,{
        httpOnly:true,
        maxAge: 7*24*60*60*1000,
    })
    return res.status(201).json(user);

}catch(e){
    console.log(e);
    return res.status(500).json({message:"User can't be created"});
}
}

export const login=async (req, res) => {
try{
    const {email,password}=req.body;
    if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
    }

    const isUserExist=await User.findOne({email});
    if(!isUserExist){
        return res.status(400).json({message:"User does not exists"});
    }
    
    const isMatch=await bcrypt.compare(password,isUserExist.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid password"});
    }
    const token =genToken(isUserExist._id);

    res.cookie("token",token,{
        httpOnly:true,
        maxAge: 7*24*60*60*1000,
    });

    return res.status(200).json(isUserExist);

}catch(e){
    console.log(e);
    return res.status(500).json({message:"User can't be created"});
}
}

export const logout=async (req, res)=> {
    try{
        res.clearCookie("token");
        return res.status(200).json({message:"Loggged out successfully"});
    }
    catch(e){
        console.log("Logout error",e);
    }
}