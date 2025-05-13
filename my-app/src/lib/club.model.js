import mongoose from 'mongoose';

const clubSchema= new mongoose.Schema({
  clubname:{
    type:String,
    unique:true,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  follower_count:{
    type:Number,
    default:0
  },
});

const Club=mongoose.model("Club",clubSchema);
export default Club;