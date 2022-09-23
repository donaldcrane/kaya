import { Schema, model } from "mongoose";
import { IChannel } from "../utils/interface";

const channelSchema = new Schema(
  {
    name: { type: String },
    type: {
      type: String,
      enum: ["public", "private"],
      default: "private"
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true },
);

export default model<IChannel>("Channel", channelSchema);
