import mongoose from "mongoose";
import Like from '../models/likeModel.js';

export const likePost = async (req, res) => {
    try {
      const postId = req.params.pid;
      const userId = req.user._id;
  
      // Check if the user has already liked the post
      const existingLike = await Like.findOne({ post: postId, liker: userId });
  
      if (existingLike) {
        // User has already liked the post, so remove the like
        await Like.deleteOne({ _id: existingLike._id }); // Remove the like by its _id
      } else {
        // User hasn't liked the post, so add the like
        const newLike = new Like({ post: postId, liker: userId });
        await newLike.save();
      }
  
      // Now, count the likes for the post
      const likeCount = await Like.countDocuments({ post: postId });
  
      return res.status(200).send({
        success: true,
        message: existingLike ? 'Like removed successfully' : 'Post liked successfully',
        likeCount: likeCount,
      });
    } catch (error) {
      // console.error(error);
      res.status(500).send({ success: false, error, message: 'Error liking/unliking post' });
    }
  };
  
  export const countLikesForPost = async (postId) => {
    try {
      const result = await Like.aggregate([
        {
          $match: {
            post: new mongoose.Types.ObjectId(postId), // Convert postId to ObjectId
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 }, // Count the number of likes
          },
        },
      ]).exec();
  
      if (result.length > 0) {
        const numberOfLikes = result[0].count;
        return numberOfLikes;
      } else {
        return 0; // Post has no likes
      }
    } catch (error) {
      // console.error('Error counting likes:', error);
      throw error;
    }
  }
  