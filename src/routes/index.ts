import express from "express";
import userRouter from "@routes/userRoute";
import organizationRouter from "@routes/organizationRoute";

const router = express.Router();

export default (): express.Router => {
  userRouter(router);
  organizationRouter(router);

  return router;
};
