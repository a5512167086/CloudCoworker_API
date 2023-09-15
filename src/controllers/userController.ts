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

    return res.status(200).json(users);
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
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
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
      return res.sendStatus(400);
    }

    const user = await getUserById(id);

    if (user === null) {
      return res.sendStatus(400);
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
      return res.status(400).json({ statusCode: 4001 });
    }

    const user = await getUserByEmail(email).select("password");

    if (!user) {
      return res.status(400).json({ statusCode: 4002 });
    }

    if (user.password != password) {
      return res.status(403).json({ statusCode: 4003 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SIGN_SECRET as string, {
      expiresIn: "12h",
    });

    return res.status(200).json({ token }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400);
    }

    const user = await createUser({
      email,
      username,
      password,
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
