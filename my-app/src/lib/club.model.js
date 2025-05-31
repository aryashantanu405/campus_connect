import mongoose from 'mongoose';

const clubSchema= new mongoose.Schema({
  clubid:{
    type:String,
    enum:["1","2","3","4","5","6"],
    required:true
  },
  clubname:{
    type:String,
    unique:true,
    required:true
  },
  clublogo:{
    type:String,
  },
  clubtype:{
    type:String,
    enum:["Technical","Cultural","Professional","Social"],
  },
  description:{
    type:String,
    required:true
  },
  followers:{
    type:Number,
    default:0
  },
});

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

export default Club;