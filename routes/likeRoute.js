import express from "express";
import { likePost } from '../controllers/likesController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

// Route for liking a post
router.post("/like/:pid", requireSignIn, likePost);

export default router;