import { Schema, model } from "mongoose";
import { ILog } from "../utils/interface";

const logSchema = new Schema(
  {
    message: { type: String },
    appiontment: { type: Schema.Types.ObjectId, ref: "Appiontment" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    vendor: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true },
);

export default model<ILog>("Log", logSchema);
