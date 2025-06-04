import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
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
    },
    year: {
      type: String,
      required: true,
    }
  },
  answers: [{
    content: {
      type: String,
      required: true,
    },
    author: {
      name: String,
      avatar: String,
      userId: String,
      year: String,
    },
    votes: {
      type: Number,
      default: 0,
    },
    votedBy: [{
      type: String,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    }
  }],
  tags: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  solved: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;