import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
  commenter: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});



export default mongoose.model('Comment', commentSchema);
