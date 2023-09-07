import express from "express";
import { createComment, deleteComment, getCommentById } from "../controllers/commentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";


//router object
const router = express.Router();

// posts router
router.post("/create-comment/:pid", requireSignIn, createComment);

//get comment by post id
router.get("/getComment/:pid", getCommentById);

// delete comment
router.delete("/deleteComment/:pid",requireSignIn, deleteComment);

export default router;