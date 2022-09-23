import { Schema, model } from "mongoose";
import { IUser } from "../utils/interface";

const userSchema = new Schema(
  {
    email: {
      type: String, unique: true, maxlength: 50, trim: true, lowercase: true
    },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, unique: true },
    active: { type: Boolean, default: true },
    photo: { type: String },
    role: { type: String, enum: ["admin", "customer", "vendor"], default: "customer" },
  },
  { timestamps: true }
);

userSchema.index({
  firstName: "text",
  lastName: "text"
});

export default model<IUser>("User", userSchema);
