import mongoose, { Schema } from "mongoose";

const songGenre = [
  "Love Song",
  "Birthday Song",
  "Custom Song",
  "Friendship Song",
];

const price = [1.499, 2.299, 3.499];

const musicGenre = [
  "Birthday Song",
  "Anniversary Ballad",
  "Wedding First Dance",
  "Friendship Tribute",
  "Family Celebration",
  "Love Declaration",
  "Inspirational Journey",
];

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
      length: [11, "Phone number must be 11 digits"],
      unique: true,
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
      enum: songGenre,
      message:
        "Role `{VALUE}` is not allowed. Must be one of: admin, editor, viewer.",
    },
    jokes: {
      type: String,
      required: false,
    },
    backgroundStory: {
      type: String,
      required: false,
    },
    plan: {
      // type: mongoose.schema.Types.ObjectId,
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Plan is required"],
    },
    musicTemplate: {
      type: String,
      enum: musicGenre,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
