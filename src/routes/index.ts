import express from "express";
import userRouter from "@routes/userRoute";

const router = express.Router();

export default (): express.Router => {
  userRouter(router);

  return router;
};
