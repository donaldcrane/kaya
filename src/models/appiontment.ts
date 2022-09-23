import { Schema, model } from "mongoose";
import { IAppiontment } from "../utils/interface";

const appiontmentSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    vendor: { type: Schema.Types.ObjectId, ref: "User" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    day: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["accepted", "declined", "pending"], default: "pending" },
    reason: { type: String },
  },
  { timestamps: true }
);

export default model<IAppiontment>("Appiontment", appiontmentSchema);
