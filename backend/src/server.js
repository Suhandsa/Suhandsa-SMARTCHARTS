import express from "express";
import  dotenv from "dotenv";
dotenv.config();

const app = express(); 
const PORT=process.env.PORT;

app.get("/",(req,res)=>{
    console.log("hello world");
    res.send("hello ");
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));