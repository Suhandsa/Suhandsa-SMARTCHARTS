import express from "express";
import bodyParser from "body-parser";
import cookieParse from "cookie-parser";


// import  dotenv from "dotenv";
// dotenv.config();
// or
import "dotenv/config";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { connectdb } from "./lib/db.js";

const app = express(); 
const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParse());

app.use(express.urlencoded({ extended: true }));
app.use("/api/outh",authRoutes);
app.use("/api/outh",userRoutes);


app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
    connectdb();
} );