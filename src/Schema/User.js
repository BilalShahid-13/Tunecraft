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
    crafterId: {
      type: String,
      default: "C001",
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

userSchema.pre("save", async function (next) {
  // Skip if crafterId is already set (not a new order)
  if (this.crafterId && this.crafterId !== "C001") {
    return next();
  }

  try {
    // Find the order with the highest crafterId
    const highestOrder = await mongoose.models.Order.findOne({}, { crafterId: 1 })
      .sort({ crafterId: -1 }) // Sort descending by crafterId
      .limit(1);

    if (!highestOrder) {
      // If no orders exist yet, use the default C001
      this.crafterId = "C001";
    } else {
      // Extract the numeric part from the highest crafterId, e.g. "T005" -> 5
      const currentId = highestOrder.crafterId;
      const numericPart = Number.parseInt(currentId.substring(1), 10);

      // Increment the number
      const nextNumericPart = numericPart + 1;

      // Format with leading zeros to maintain 3 digits
      this.crafterId = `T${nextNumericPart.toString().padStart(3, "0")}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
