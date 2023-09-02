import jwt from "jsonwebtoken";
import express from "express";
import { statusCodes } from "@configs/common";

const isAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token;
  try {
    if (req.headers["authorization"] === undefined) {
      return res.status(400).json({
        statusCode: statusCodes.UNAUTHORIZED_FIELD_UNFULFILLMENT,
        message: "Authorization should not be empty",
      });
    }

    token = req.headers["authorization"].split(" ")[1];
  } catch (e) {
    token = "";
  }

  jwt.verify(token, process.env.JWT_SIGN_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        statusCode: statusCodes.UNAUTHORIZED,
        message: "Unauthorized",
      });
    } else {
      next();
    }
  });
};

export default isAuth;
