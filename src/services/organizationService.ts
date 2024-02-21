import { OrganizationModel } from "@models/organization";
import mongoose from "mongoose";

export const getOrganizationById = (organizationId: mongoose.Types.ObjectId) =>
  OrganizationModel.findById(organizationId);

export const getOrganizationByInviteCode = (inviteCode: string) =>
  OrganizationModel.findOne({ inviteCode });

export const createOrganization = (values: Record<string, any>) =>
  new OrganizationModel(values)
    .save()
    .then((organization) => organization.toObject());

export const deleteOrganizationById = (id: mongoose.Types.ObjectId) =>
  OrganizationModel.findOneAndDelete({ _id: id });

export const updateOrganizationById = (
  id: mongoose.Types.ObjectId,
  values: Record<string, any>
) => OrganizationModel.findByIdAndUpdate(id, values);

export const addOrganizationMemberById = (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) =>
  OrganizationModel.findByIdAndUpdate(id, {
    $push: { members: userId },
  });

export const deleteOrganizationMemberById = (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) =>
  OrganizationModel.findByIdAndUpdate(id, {
    $pull: { members: userId },
  });
