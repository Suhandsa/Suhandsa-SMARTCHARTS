import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyFriends,getRecommendedUser } from "../controllers/users.controller.js";

const router=express.Router();


router.use(protectRoute);


router.get("/",getRecommendedUser);
router.get("/friends",getMyFriends);

export default router;