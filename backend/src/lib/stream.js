import stream, { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error("Missing Stream API Key or Secret");
}

const streamClient = new StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
   try{
   await streamClient.upsertUsers([userData]);
   return userData;
   }catch(error){
    console.log("error in upsertStreamUser", error);
   }
}

//to do later
export const generateStreamToken=async (userId)=>{};

