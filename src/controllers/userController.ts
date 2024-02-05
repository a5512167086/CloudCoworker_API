import express from "express";
import jwt from "jsonwebtoken";
import {
  deleteUserById,
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
} from "@services/userService";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).end();
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.sendStatus(200).json(deletedUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).end();
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
      return res.sendStatus(400).end();
    }

    const user = await getUserById(id);

    if (user === null) {
      return res.sendStatus(400).end();
    }

    user.username = username;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).end();
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
    return res.sendStatus(400).end();
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
    return res.sendStatus(400).end();
  }
};
