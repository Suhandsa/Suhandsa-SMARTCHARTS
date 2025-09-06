import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const login = async function(req, res){
    const {email,password,fullName}= req.body;
    
    try{
        if(!email || !password || !fullNmae){
        return res.status(400).json({message:"All fields are required"});
    }

    //cheaking the length of password
    if(password.length < 6){
        return res.status(400).json({message:"Password must be at least 6 characters"});
    }

    //cheaking the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email format"});
    }

    //cheaking the email format
    const fullNameRegex = /^[A-Za-z\s]+$/;
    if(!fullNameRegex.test(fullName)){
        return res.status(400).json({message:"Invalid fullName format"});
    }

   const existingUser = await User.findOne({email:email});
    if(existingUser){
        return res.status(400).json({message:"email already exists"});
    }
    //profile pic
    const randomAvatar=`https://avatar.iran.liara.run/username?username=${fullName}`;
    //new user
    const newUser = new User.create({
        email,
        fullName,
       password,
       profilePic:randomAvatar,
       
    });

    //TODO USER IN STREAM AS WELL

    //creating the token
    const token= jwt.sign({userId:newUser._Id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});


   res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,//prvebt from xss attack
    sameSite:"strict",
    secure:process.env.NODE_ENV==="production",
    });
   
    res.status(201).json({success:true, User:newUser,message:"User created", token, userId:newUser._Id});



    }
    catch (error){
  console.log("error in signup controller",error);
  res.status(500).json({success:false, message:"Internal server error"});
    
}
}



export const logout = async function(req, res){
    res.send("hello logout");
}

export const signup = async function(req, res){
    res.send("hello signup");
}