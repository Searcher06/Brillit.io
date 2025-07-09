import mongoose from "mongoose";
// Defining a Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Firstname is required"],
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, "Lastname is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Email is invalid"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 6,
  },

  profilePic: {
    type: String,
    default: "",
  },

  suggestedKeywords: {
    type: [String],
    default: [],
  },
  isPersonalized: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Creating a model
export const userModel = mongoose.model("User", userSchema);
