import {
  currentStageEnum,
  musicTemplates,
  QuestionsItem,
  submissionStatusEnum,
} from "@/lib/Constant";
import mongoose from "mongoose";

const songGenreEnum = QuestionsItem.map((item) => item.question);
const musicGenreEnum = musicTemplates.map((item) => item.title);

const baseCrafterSchema = {
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
  taskDeadline: {
    type: Date,
    default: null,
  },
  // extension
  extension: {
    granted: { type: Boolean, default: false }, // have they used their +3h?
    until: { type: Date, default: null }, // when that +3h expires
  },
  // plenty if crafters not submit order
  penaltyCount: { type: Number, default: 0 },
  submittedAtTime: {
    type: Date,
    default: null,
  },
  // rejected user if crafter not submit the order after extension
  rejectedCrafters: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [], // ← ensure every new doc has an empty array
  },

  submittedFile: [
    {
      fileName: { type: String, default: "" },
      fileUrl: { type: String, default: "" },
    },
  ],
  revisionAttempts: { type: Number, default: 0 },
  adminFeedback: { type: String, default: "" },
  crafterFeedback: { type: String, default: "" },
};

const craftersObject = {
  lyricist: {
    ...baseCrafterSchema,
  },
  singer: {
    ...baseCrafterSchema,
  },
  engineer: { ...baseCrafterSchema },
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
    orderId: {
      type: String,
      default: "T001",
    },
    finalSongUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  // Skip if orderId is already set (not a new order)
  if (this.orderId && this.orderId !== "T001") {
    return next();
  }

  try {
    // Find the order with the highest orderId
    const highestOrder = await mongoose.models.Order.findOne({}, { orderId: 1 })
      .sort({ orderId: -1 }) // Sort descending by orderId
      .limit(1);

    if (!highestOrder) {
      // If no orders exist yet, use the default T001
      this.orderId = "T001";
    } else {
      // Extract the numeric part from the highest orderId, e.g. "T005" -> 5
      const currentId = highestOrder.orderId;
      const numericPart = Number.parseInt(currentId.substring(1), 10);

      // Increment the number
      const nextNumericPart = numericPart + 1;

      // Format with leading zeros to maintain 3 digits
      this.orderId = `T${nextNumericPart.toString().padStart(3, "0")}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
