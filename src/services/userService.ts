import { UserModel } from "@models/user";
import mongoose from "mongoose";

export const getUsers = () => UserModel.find({}, { password: 0 });

export const getUserById = (id: string) =>
  UserModel.findById(id, { password: 0 });

export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email }, { password: 0 });

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: mongoose.Types.ObjectId) =>
  UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (
  id: mongoose.Types.ObjectId,
  values: Record<string, any>
) => UserModel.findByIdAndUpdate(id, values);
