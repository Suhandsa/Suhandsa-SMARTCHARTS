import express from "express"; 


const app = express(); 

app.get("/",(req,res)=>{
    console.log("hello world");
    res.send("hello ");
});
app.listen(5001, () => console.log('Server started on port 5001'));