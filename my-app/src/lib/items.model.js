import mongoose from "mongoose";
import { notFound } from "next/navigation";

const itemSchema = new mongoose.Schema({
  id:{
    type: String,
    required: true,
  },
  owner_username: {
    type: String,
    required: true,
  },
  place:{
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
    enum: ['lost', 'found'],
    default: 'lost',
    required: true,
  },

});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
export default Item;