import {
  createNewOrganization,
  deleteOrganization,
  joinOrganization,
  leaveOrganization,
} from "@controllers/organizationController";
import isAuth from "@middlewares/userValidation";
import express from "express";

export default (router: express.Router) => {
  router.post("/organization", isAuth, createNewOrganization);
  router.post("/organization/join", isAuth, joinOrganization);
  router.post("/organization/leave", isAuth, leaveOrganization);
  router.post("/organization/delete", isAuth, deleteOrganization);
};
