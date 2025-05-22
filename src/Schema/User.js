import mongoose from "mongoose"

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
      default: "T001",
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
  },
)

// Pre-save middleware to generate sequential crafterId
userSchema.pre("save", async function (next) {
  // Skip if crafterId is already set (not a new user)
  if (this.crafterId !== "T001") {
    return next()
  }

  try {
    // Find the user with the highest crafterId
    const highestUser = await mongoose.models.User.findOne({}, { crafterId: 1 })
      .sort({ crafterId: -1 }) // Sort in descending order to get the highest
      .limit(1)

    if (!highestUser) {
      // If no users exist yet, use the default T001
      this.crafterId = "T001"
    } else {
      // Extract the number part from the highest crafterId
      const currentId = highestUser.crafterId
      const numericPart = Number.parseInt(currentId.substring(1), 10)

      // Increment the number
      const nextNumericPart = numericPart + 1

      // Format with leading zeros to maintain 3 digits
      this.crafterId = `T${nextNumericPart.toString().padStart(3, "0")}`
    }

    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
