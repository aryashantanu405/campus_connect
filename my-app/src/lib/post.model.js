import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_src: {
    type: String,
    // required: false,
  },
  author: {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: String,
    ref: 'User'
  }],
  tags: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;