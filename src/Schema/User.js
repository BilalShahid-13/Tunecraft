import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, "email required"], unique: true },
    username: { type: String, required: [true, "username required"] },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["lyricist", "singer", "engineer", "admin"],
      required: true,
    },
    musicTemplate: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    info: {
      type: String,
      required: false,
    },
    cv: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    activeOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    lateSubmissionCount: {
      type: Number,
      default: 0,
    },
    taskAccessBlockedUntil: {
      type: Date,
      default: null,
    },
    canAcceptNewOrders: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
