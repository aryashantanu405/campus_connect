import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  owner_username: {
    type: String,
    required: true,
  },
  place: {
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
  image: {
    type: {
      url: {
        type: String,
        default: "https://images.pexels.com/photos/1010496/pexels-photo-1010496.jpeg"
      },
      public_id: {
        type: String,
        default: null
      }
    },
    required: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    default: 'lost',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'claimed'],
    default: 'active'
  },
  claimed_by: {
    type: String,
    default: null
  },
  claimed_date: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
export default Item;