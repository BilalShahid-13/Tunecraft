// models/Payment.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const paymentSchema = new Schema(
  {
    crafterRole: {
      type: String,
      required: true,
      enum: ["lyricist", "engineer", "singer"],
    },
    crafterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Plan",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite upon initial compile
const Payment = models.Payment || model("Payment", paymentSchema);
export default Payment;
