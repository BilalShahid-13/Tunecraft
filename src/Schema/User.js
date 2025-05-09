import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, "email required"], unique: true },
    username: { type: String, required: [true, "username required"] },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["lyricist", "singer", "engineer"],
      required: true,
    },
    musicTemplate: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    info:{
      type:String,
      required:false
    },
    cv: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
