import Comment from "../models/commentModel.js";
import mongoose from "mongoose";

export const createComment = async(req,res) => {
    try{
        const {text} = req.body;
        const postId = req.params.pid;
        switch(true){
            case !text:
                return res.status(400).send({error:"comment is needed"});
            case !mongoose.Types.ObjectId.isValid(postId):
                return res.status(400).send({ error: "Invalid post ID" });
        }
        const newComment = new Comment({
            text,
            post:postId,
            commenter: req.user._id,
        });

        await newComment.save();

        res.status(201).send({
            success: true,
            message: "Commented Successfully",
            comment: newComment,
          });

    }catch (error) {
        // console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in Commenting",
          error,
        });
    }
}

export const getCommentById = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.pid });
        return res.status(200).send(comments);
    } catch (error) {
      // console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting comments by post ID",
        error,
      });
    }
  }

  export const deleteComment = async (req, res) => {
    try {
      const commentId = req.params.pid;
      const userId = req.user._id;
  
      // Find the comment by ID
      const comment = await Comment.findById(commentId);
  
      // Check if the comment exists
      if (!comment) {
        return res.status(404).send({ error: 'Comment not found' });
      }
  
      // Check if the user is the owner of the comment
      if (comment.commenter.toString() !== userId.toString()) {
        return res.status(403).send({ error: 'Permission denied' });
      }
  
      // Delete the comment
      await Comment.findByIdAndDelete(commentId);
  
      res.status(200).send({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      // console.error(error);
      res.status(500).send({ success: false, message: 'Error deleting comment', error });
    }
}