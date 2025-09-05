import mongose from "mongoose";

export const connectdb = async ()=> {
  try {
    const conn=await mongose.connect(process.env.MONGO_URI);
    console.log(`db connected ${conn.connection.host}`);

    
  } catch (error) {
    console.log("error in connecting to db",error);
    process.exit(1);//1means failure

  }
}