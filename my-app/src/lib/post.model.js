import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const postSchema = new mongoose.Schema({
  id:{
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image_src: {
    type: String,
  },
   likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
    
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;