import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
  author: { 
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  content: mongoose.Schema.Types.Mixed, // Using Mixed data type for flexible content
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

export default mongoose.model('Post', postSchema);