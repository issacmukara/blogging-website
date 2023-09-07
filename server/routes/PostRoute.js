import express from "express";
import { getAPost, createPost, postPhoto, updatePost, getPostById, deletePost, getPostsByUserId } from "../controllers/postsController.js";
import formidable from "express-formidable";
import { requireSignIn } from "../middlewares/authMiddleware.js";
//router object
const router = express.Router();

// posts router
router.post("/create-post", requireSignIn, formidable(), createPost);

// getting posts router
router.get("/posts", getAPost);

// // single post
// router.get("/posts/:slug", getSinglePost);

//get photo
router.get("/post-photo/:pid", postPhoto);

//update post
router.put("/update-post/:pid",requireSignIn,formidable(), updatePost);

//get comment by post id
router.get("/getPostById/:pid", getPostById);

// delete post 
router.delete("/deletePost/:pid",requireSignIn, deletePost);

// get user posts
router.get("/userPosts",requireSignIn, getPostsByUserId);

export default router;
