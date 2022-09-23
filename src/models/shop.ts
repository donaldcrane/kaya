import { Schema, model } from "mongoose";
import { IShop } from "../utils/interface";

const shopSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    address: { type: String, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

shopSchema.index({
  name: "text",
  address: "text"
});

export default model<IShop>("Shop", shopSchema);
