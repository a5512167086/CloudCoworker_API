import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { uid } from "uid";
import {
  addOrganizationMemberById,
  createOrganization,
  deleteOrganizationById,
  deleteOrganizationMemberById,
  getOrganizationById,
  getOrganizationByInviteCode,
} from "@services/organizationService";
import { getUserByEmail, updateUserById } from "@services/userService";
import mongoose from "mongoose";

export const createNewOrganization = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { organizationName } = req.body;
    const token = req.headers.authorization!.split(" ")[1];
    const userData = jwt.decode(token) as JwtPayload;
    const user = await getUserByEmail(userData.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }
    if (user.organization) {
      return res
        .status(400)
        .json({
          message:
            "Can't creating organization without leaving current organization",
        })
        .end();
    }

    const inviteCode = uid(16);
    const organization = await createOrganization({
      organizationName,
      inviteCode,
      owner: user["_id"],
    });

    await updateUserById(user["_id"], { organization: organization["_id"] });

    return res.status(200).json({ message: "Success" }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const joinOrganization = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { inviteCode } = req.body;
    const token = req.headers.authorization!.split(" ")[1];
    const userData = jwt.decode(token) as JwtPayload;
    const user = await getUserByEmail(userData.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }

    const organization = await getOrganizationByInviteCode(inviteCode);
    if (!organization) {
      return res.status(400).json({ message: "Organization not found" }).end();
    }
    if (
      (organization.owner as mongoose.Types.ObjectId).equals(user["_id"]) ||
      organization.members.includes(
        user["_id"] as mongoose.Types.ObjectId as any
      ) ||
      user.organization
    ) {
      return res
        .status(200)
        .json({ message: "Can't join the organization" })
        .end();
    }

    await addOrganizationMemberById(organization["_id"], user["_id"]);
    await updateUserById(user["_id"], { organization: organization["_id"] });
    return res.status(200).json({ message: "Success" }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const leaveOrganization = async (
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
      user["organization"] as mongoose.Types.ObjectId
    );

    if (!organization) {
      return res.status(400).json({ message: "Organization not found" }).end();
    }
    if ((organization.owner as mongoose.Types.ObjectId).equals(user["_id"])) {
      return res
        .status(400)
        .json({ message: "Owner can't leave the organization" })
        .end();
    }

    await updateUserById(user["_id"], { organization: null });
    await deleteOrganizationMemberById(organization["_id"], user["_id"]);
    return res.status(200).json({ message: "Success" }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteOrganization = async (
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
      user["organization"] as mongoose.Types.ObjectId
    );

    if (!organization) {
      return res.status(400).json({ message: "Organization not found" }).end();
    }
    if (!(organization.owner as mongoose.Types.ObjectId).equals(user["_id"])) {
      return res
        .status(400)
        .json({ message: "Only owner can't delete the organization" })
        .end();
    }

    organization.members.forEach(async (member) => {
      await updateUserById(member as mongoose.Types.ObjectId, {
        organization: null,
      });
    });
    await updateUserById(organization.owner as mongoose.Types.ObjectId, {
      organization: null,
    });
    await deleteOrganizationById(
      user["organization"] as mongoose.Types.ObjectId
    );

    return res.status(200).json({ message: "Success" }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
