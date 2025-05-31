import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  avatar: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);