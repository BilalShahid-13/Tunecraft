import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({
  name: {
    type: String,
    required: [true, "Plan name is required"],
  },
  price: {
    type: Number,
    min: [0, "Price must be greater than 0"],
    required: [true, "Price is required"],
  },
});

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
export default Plan;
