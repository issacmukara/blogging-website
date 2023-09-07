import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model('Photo', photoSchema);

