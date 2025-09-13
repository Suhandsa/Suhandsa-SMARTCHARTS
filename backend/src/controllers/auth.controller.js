import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async function(req, res){
    const {email,password,fullName}=  req.body;
    
    try{
        if(!email || !password || !fullName){
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
    const newUser = await User.create({
        email,
        fullName,
       password,
       profilePic:randomAvatar,
       
    });

    try{
        await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullName,
        image:newUser.profilePic || "" ,
       
    });
     console.log(`Stream user created successfully" , ${newUser._id.toString()} `);
    }catch (error){
        console.log('error in upsertStreamUser' ,error);
    }



    //creating the token
    const token= jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});


   res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,//prvebt from xss attack
    sameSite:"strict",
    secure:process.env.NODE_ENV==="production",
    });
   
    res.status(201).json({success:true, user:newUser,message:"User created", token, userId:newUser._Id});
    

    }
    catch (error){
  console.log("error in signup controller",error);
  res.status(500).json({success:false, message:"Internal server error"});
    
}
}





export const login = async function(req, res){
  try{
     const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please provide email and password"});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid email or password"});
    }
    //creating the token
    const token= jwt.sign({
        userId:user._id,
        },process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

        //setting the cookie
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,//prvebt from xss attack
        sameSite:"strict",
        secure:process.env.NODE_ENV==="production",
        });
    res.status(200).json({success:true, user:user,message:"User logged in", token, userId:user._Id});



  }catch(error){
  console.log("error in login controller",error);
    res.status(500).json({success:false, message:"Internal server error"});
  }
}

export const logout = async function(req, res){
    res.clearCookie("jwt");
    res.status(200).json({success:true, message:"User logged out"});

}

export async function onboard(req,res){
    //console.log("hi");
   //  console.log(req.user);

   try{
        const userId=req.user._id;

        const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
           return  res.status(400).json({
                message:"All fields  are required",
                missingFields:[
                    !fullName && "fullname",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }
        const updatedUser=await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true,
        },{new:true})

        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }


        //to do update in the getstream
        try{
          await  upsertStreamUser({
            id:updatedUser._id.toString(),
            name:updatedUser.fullName,
            image:updatedUser.profilePic || ""
          })
          console.log(`stream user  updated after onboarding for ${updatedUser.fullName} `);
        }catch(streamError){
            console.log("Error  updating stream  user during  onboarding: ",streamError.message);
        }

        res.status(200).json({success:true,user:updatedUser});

   }catch(error){
       console.log("Onboarding error:",error);
       res.status(500).json({message:"Internal server error"});
   }


}