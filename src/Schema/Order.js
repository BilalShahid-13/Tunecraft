import {
  currentStageEnum,
  musicTemplates,
  QuestionsItem,
  submissionStatusEnum,
} from "@/lib/Constant";
import mongoose from "mongoose";

const songGenreEnum = QuestionsItem.map((item) => item.question);
const musicGenreEnum = musicTemplates.map((item) => item.title);

const craftersObject = {
  lyricist: {
    assignedCrafterId: {
      // ✅ this is your reference to the user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submissionStatus: {
      type: String,
      enum: submissionStatusEnum,
      default: "pending",
    },
    assignedAtTime: {
      type: Date,
      default: null,
    },
    gracePeriodGranted: {
      type: Boolean,
      default: false,
    },
    submittedAtTime: {
      type: Date,
      default: null,
    },
    submittedFileUrl: {
      type: [String],
      default: null,
    },
    revisionAttempts: { type: Number, default: 0 },
    adminFeedback: { type: String, default: "" },
  },
  singer: {
    assignedCrafterId: {
      // ✅ this is your reference to the user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submissionStatus: {
      type: String,
      enum: submissionStatusEnum,
      default: "pending",
    },
    assignedAtTime: {
      type: Date,
      default: null,
    },
    submittedAtTime: {
      type: Date,
      default: null,
    },
    submittedFileUrl: {
      type: [String],
      default: null,
    },
    revisionAttempts: { type: Number, default: 0 },
    adminFeedback: { type: String, default: "" },
  },
  engineer: {
    assignedCrafterId: {
      // ✅ this is your reference to the user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submissionStatus: {
      type: String,
      enum: submissionStatusEnum,
      default: "pending",
    },
    assignedAtTime: {
      type: Date,
      default: null,
    },
    submittedAtTime: {
      type: Date,
      default: null,
    },
    submittedFileUrl: {
      type: [String],
      default: null,
    },
    revisionAttempts: { type: Number, default: 0 },
    adminFeedback: { type: String, default: "" },
  },
};

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    songGenre: {
      type: String,
      required: [true, "Genre is required"],
      enum: songGenreEnum,
      message:
        "Role `{VALUE}` is not allowed. Must be one of: admin, editor, viewer.",
    },
    jokes: {
      type: String,
      required: false,
    },
    backgroundStory: {
      type: String,
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Plan is required"],
    },
    musicTemplate: {
      type: String,
      enum: musicGenreEnum,
      required: false,
    },
    currentStage: {
      type: String,
      enum: currentStageEnum,
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    crafters: craftersObject,
    finalSongUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
