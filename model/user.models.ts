import { Schema } from "mongoose";
import mongoose from "mongoose";
const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
    friend: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("user", UserSchema);
