import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, "email required"], unique: true },
    username: { type: String, required: [true, "username required"] },
    password: { type: String, required: [true, "password required"] },
    role: {
      type: String,
      enum: ["lyricist", "singer", "engineer"],
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
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   // Only hash the password if it has been modified (or is new)
//   if (!this.isModified("password")) return next();

//   try {
//     // Check if password exists (double safety)
//     if (!this.password) {
//       throw new Error("Password is required");
//     }

//     // Generate salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     return next();
//   } catch (error) {
//     console.error("Password hashing error:", error);
//     return next(error); // Pass the error to Mongoose
//   }
// });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
