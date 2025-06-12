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
    userId: {
      type: String,
      default: "C001",
    },
    activeOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    penaltyCount: { type: Number, default: 0 },
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
  // Skip if userId is already set (not a new user)
  if (this.userId && this.userId !== "C001") {
    return next();
  }

  try {
    // Find the user with the highest userId
    const highestUser = await mongoose.models.User.findOne({}, { userId: 1 })
      .sort({ userId: -1 }) // Sort descending by userId
      .limit(1);

    if (!highestUser) {
      // If no users exist yet, use the default C001
      this.userId = "C001";
    } else {
      // Extract the numeric part from the highest userId, e.g. "C005" -> 5
      const currentId = highestUser.userId;
      const numericPart = Number.parseInt(currentId.substring(1), 10);

      // Increment the number
      const nextNumericPart = numericPart + 1;

      // Format with leading zeros to maintain 3 digits
      this.userId = `C${nextNumericPart.toString().padStart(3, "0")}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
