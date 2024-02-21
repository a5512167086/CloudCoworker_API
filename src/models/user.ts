import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    organization: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
