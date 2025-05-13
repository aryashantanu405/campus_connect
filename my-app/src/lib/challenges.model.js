import mongoose
 from "mongoose";

const challengeSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    required: true,
  },
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
export default Challenge;