// lib/user.model.js

import { Biohazard } from "lucide-react";
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
  location:String,
  department: String,
  current_year: String,
  points: {
    type: Number,
    default: 0,
  },
  clubsfollowed: {
    type: [String],
    default: [],
    enum: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ],
  },
  numberofclubsjoined: {
    type: Number,
    default: 0,
  },
  phonenumber:{
    type: String,
    unique: true,
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
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
