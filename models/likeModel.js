import mongoose  from "mongoose";
const likeSchema = new mongoose.Schema({
    likes:{
      type:Number,
      default:0,
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
    liker: { // who is liking
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // You can add other fields like user, date, etc.
  });

  export default mongoose.model('Like', likeSchema);