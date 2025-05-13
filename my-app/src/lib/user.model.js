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
  department: String,
  current_year: Number,
  points: {
    type: Number,
    default: 0,
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
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
