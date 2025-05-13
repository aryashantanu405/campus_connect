import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: {
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
  posted_by:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  answers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      answer: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  upvotes: {
    type: Number,
    default: 0,
  },

});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
export default Question;