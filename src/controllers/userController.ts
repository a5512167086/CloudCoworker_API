import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  deleteUserById,
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
} from "@services/userService";
import { getOrganizationById } from "@services/organizationService";
import mongoose from "mongoose";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];

    const userData = jwt.decode(token) as JwtPayload;
    const user = await getUserByEmail(userData.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }

    const deletedUser = await deleteUserById(user["_id"]);

    return res.status(200).json(deletedUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).end();
    }

    const user = await getUserById(id);

    if (user === null) {
      return res.status(400).end();
    }

    user.username = username;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ statusCode: 4001 }).end();
    }

    const user = await getUserByEmail(email).select("password");

    if (!user || user.password != password) {
      return res.status(400).json({ statusCode: 4002 }).end();
    }

    const token = jwt.sign({ email }, process.env.JWT_SIGN_SECRET as string, {
      expiresIn: "12h",
    });

    return res
      .status(200)
      .json({ userName: user.username, userEmail: user.email, token })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ statusCode: 4003 }).end();
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ statusCode: 4004 }).end();
    }

    await createUser({
      email,
      username,
      password,
    });

    return res.status(200).json({ message: "Success" }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const checkLogin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    const userData = jwt.decode(token) as JwtPayload;
    const user = await getUserByEmail(userData.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }

    return res
      .status(200)
      .json({ userEmail: user.email, userName: user.username, token: token })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUserOrganization = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    const userData = jwt.decode(token) as JwtPayload;
    const user = await getUserByEmail(userData.email);
    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }

    const organization = await getOrganizationById(
      user.organization as mongoose.Types.ObjectId
    );
    if (!organization) {
      return res.status(400).json({ message: "Organization not found" }).end();
    }

    return res
      .status(200)
      .json({
        organizationId: organization["_id"],
        organizationName: organization.organizationName,
        organizationOwner: organization.owner,
        organizationMembers: organization.members,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
