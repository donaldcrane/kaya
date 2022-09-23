import { Schema, model } from "mongoose";
import { IMessage } from "../utils/interface";

const messageSchema = new Schema(
  {
    message: { type: String },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default model<IMessage>("Message", messageSchema);
