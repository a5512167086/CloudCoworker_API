import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  register,
  login,
  checkLogin,
  getUserOrganization,
} from "@controllers/userController";
import isAuth from "@middlewares/userValidation";

export default (router: express.Router) => {
  router.get("/users", isAuth, getAllUsers);
  router.get("/users/checkLogin", isAuth, checkLogin);
  router.get("/users/getOrganization", isAuth, getUserOrganization);
  router.delete("/users/:id", isAuth, deleteUser);
  router.patch("/users/:id", isAuth, updateUser);
  router.post("/users/register", register);
  router.post("/users/login", login);
};
