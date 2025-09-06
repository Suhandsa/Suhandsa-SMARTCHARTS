import express from "express";


// import  dotenv from "dotenv";
// dotenv.config();
// or
import "dotenv/config";

import authRoutes from "./routes/auth.route.js";
import { connectdb } from "./lib/db.js";

const app = express(); 
const PORT=process.env.PORT;
app.use(express.json());


app.use("/api/outh",authRoutes);
app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
    connectdb();
} );