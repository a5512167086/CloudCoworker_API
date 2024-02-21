import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const OrganizationModel = mongoose.model(
  "Organization",
  OrganizationSchema
);
