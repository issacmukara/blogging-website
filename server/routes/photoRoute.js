import express from "express";
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { createPhoto, deletePhotoByUserId, getPhotoByUserId, modifyPhotoByUserId } from "../controllers/photoController.js";
import formidable from "express-formidable";

//router object
const router = express.Router();

// Route for liking a post
router.post("/createPhoto/:pid",requireSignIn, formidable(), createPhoto);

// Route for getting a user's photo by user ID
router.get("/getPhoto/:pid", getPhotoByUserId);

// Delete the userPhoto
router.delete("/delete/:pid", requireSignIn, deletePhotoByUserId);

// Modify the userPhoto
router.put("/updatePhoto/:pid", requireSignIn, formidable(), modifyPhotoByUserId);


export default router;