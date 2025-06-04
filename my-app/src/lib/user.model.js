import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    maxlength: 20,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  location: String,
  department: {
    type: String,
    default: "ECE"
  },
  image:{
    url:{
      type:String,
      default:""
    },
    public_id:{
      type: String,
      default: ""
    }
  },
  current_year: {
    type: String,
    default: "1"
  },
  points: {
    type: Number,
    default: 0,
  },
  clubsfollowed: {
    type: [String],
    default: [],
  },
  numberofclubsjoined: {
    type: Number,
    default: 0,
  },
  phonenumber: {
    type: String,
    default: "9999999999",
  },
  hobbies: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: "",
  },
  githubprofile: {
    type: String,
    default: "",
  },
  linkedinprofile: {
    type: String,
    default: "",
  },
  numberofchallengesjoined: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;