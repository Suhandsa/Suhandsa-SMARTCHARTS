export async function getRecommendedUser(req,res){

    try {
        const currentUserId=req.user.id;
        const currentUser= req.user;

        const recommendedUsers=user.find({
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
        const user=await user.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller ",error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}