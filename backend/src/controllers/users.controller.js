import User from "../models/User.js";
import FriendRequest   from "../models/User.js";
export async function getRecommendedUser(req,res){

    try {
        const currentUserId=req.user.id;
        const currentUser= req.user;

        const recommendedUsers= await User.find({
            $and :[
                {_id:{$ne:currentUserId}},
                {$id:{$nin:currentUser.friends}},
                {isOnboarded:true},
            ],
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("error in the getrecommended controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export async function getMyFriends(req,res){
    try {
        const user=await User.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller ",error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export async function sendFriendRequest(req,res){
    try {
        
        const myId=req.user.id;
        const{id: recipientId}=req.params;

  //checking whether request is sent to out self
  if(myId==recipientId) {
    return res.status(400).json({message:"you can't send friend request to yourself"});
  }

  const recipient=await User.findById(recipientId);
  if(!recipient){
    return res.status(400).json({message:"recipient not found"});
  }

  if(recipient.friends.includes(myId)){
    return res.status(400).json({message:" you are already friends with this user"});
  }

  //check if areq already exist 
  const existingRequest= await FriendRequest.findOne({
    $or:[
        {sender:myId,recipient:recipientId},
        {sender:recipientId,recipient:myId}
    ],
  });

  if(existingRequest){
    return res.status(400).json({message:"a friend  request already exist between you and this user "});
  }

  const friendRequest=await FriendRequest.create({
    sender:myId,
    recipient:recipient,
  });
  res.status(201).json(friendRequest);

    } catch (error) {
         console.error("Error in sendfriendrequest controller ",error.message);
        res.status(500).json({message:"Internal server error"});     
    }
}

export async function acceptFriendRequest(rq,res){
  try {


    const {id:requestId}=req.params;

    const friendRequest=await FriendRequest.findById(requestId);
    
    //friendrequest not found condition
    if(!friendRequest){
      res.status(404).json({message:"friend request is not fount"});
    }

    //verify the current user is the recipent
    if(friendRequest.recipient.toString()!==req.user.id){
      return res.status(403).json({message:"you are not authorized to accept this request"});
    }

    friendRequest.status="accepted";
    await friendRequest.save();

    //add each user id to the each other

    await  User.findByIdAndUpdate(friendRequest.recipient,{
      $addToSet:{friends:friendRequest.sender},
    });

    await  User.findByIdAndUpdate(friendRequest.sender,{
      $addToSet:{friends:friendRequest.recipient},
    });
  } catch (error) {
    console.log("error in acceptFriendRequest controller ",error.message);
    res.status(500).json({message:"Internal server error"});
  }
}

export async function getFriendRequests(req,res){
  try {
    
    const incomingReqs=await FriendRequest.find({
      recipient:req.user.id,
      status:"pending",
    }).populate("sender","fullName profilePic nativeLanguage learningLanguage ");

      const acceptedReqs= await FriendRequest.find({

        recipient:req.user.id,
        status:"accepted",
      }).populate("recipient","fullName profilePic");
      res.status(200).json({incomingReqs,acceptedReqs});
  } catch (error) {
    console.log("error in getFriendRequest controller ",error.message);
    res.status(500).json({message:"Internal server error"});

  }
}

export async function getOutgoingFriendReqs(req,res){
  try {
    const outgoingRequest=await FriendRequest.find({
      recipient:req.user.id,
      status:"pending",
    }).populate("recipient","fullName profilePic nativeLanguage learningLanguage ");
    res.status(200).json(outgoingRequest);
    
  } catch (error) {
      console.log("error in getOutgoingFriendReqs controller ",error.message);
    res.status(500).json({message:"Internal server error"});

  }
}