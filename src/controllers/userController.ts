import asyncHandler from "express-async-handler";
import { UserPublic, iValidatedUserData } from "../lib/types/types";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma/prisma";
import jwt from "jsonwebtoken";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import { Request } from "express";
import { UserRole } from "@prisma/client";
import {
  LoginUserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UpgradeUserSchema,
} from "../lib/zod/User";
import sendResponse from "../lib/controllerUtils/sendResponse";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import userQuery from "../lib/prisma/queries/userQuery";

const users_list = asyncHandler(async (req, res) => {
  const allUsers = await userQuery.list();

  sendResponse(res, "User list retrieved successfully.", allUsers);
});

const user_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const user: UserPublic | null = await userQuery.findById(id);
  if (!user) {
    sendErrorResponse(res, "Cannot find user.");
  } else {
    sendResponse(res, "User retrieved successfully.", user);
  }
});

const user_create = asyncHandler(async (req, res, next) => {
  const data = validateRequestData(req.body.data, res, CreateUserSchema);

  if (!data) return;

  bcrypt.hash(data.password, 10, async (err, hashedPassword) => {
    if (err) {
      next(err);
    }

    try {
      const newUser = await userQuery.create(data, hashedPassword);
      sendResponse(res, "User created successfully.", newUser);
    } catch (error) {
      handlePrismaError(error, res, "Error while adding user to database.");
    }
  });
});

const user_update = asyncHandler(async (req, res, next) => {
  const updateUser = async (
    req: Request,
    validatedUserData: iValidatedUserData
  ) => {
    try {
      const id = parseInt(req.params.id);
      const updatedUser = await userQuery.update(id, validatedUserData);
      sendResponse(res, "User updated successfully.", updatedUser);
    } catch (error) {
      handlePrismaError(error, res, "Error while updating user.");
    }
  };

  if (req.user?.id.toString() !== req.params.id) {
    sendErrorResponse(res, "Access denied. You cannot update this user.");
    return;
  }

  const data = validateRequestData(req.body.data, res, UpdateUserSchema);

  if (!data) return;

  if (data.password) {
    bcrypt.hash(data.password, 10, async (err, hashedPassword) => {
      if (err) {
        next(err);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...dataWithoutPassword } = data;
      const dataWithHash = {
        ...dataWithoutPassword,
        passwordHash: hashedPassword,
      };

      updateUser(req, dataWithHash);
    });
  } else {
    updateUser(req, data);
  }
});

const user_login = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, LoginUserSchema);

  if (!data) return;

  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (!user) {
    sendErrorResponse(res, "Login failed. Check credentials and try again.");
    return;
  }

  const match = await bcrypt.compare(data.password, user.passwordHash);
  if (!match) {
    sendErrorResponse(res, "Login failed. Check credentials and try again.");
    return;
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.TOKEN_SECRET || "",
    { expiresIn: "7d" }
  );

  sendResponse(res, "User logged in with returned token.", { accessToken });
});

const user_upgrade = asyncHandler(async (req, res) => {
  if (req.user?.id.toString() !== req.params.id) {
    sendErrorResponse(res, "Access denied. You cannot update this user.");
    return;
  }

  const data = validateRequestData(req.body.data, res, UpgradeUserSchema);

  if (!data) return;

  const { accessTarget, accessSecret } = data;

  if (!process.env.ADMIN_SECRET || !process.env.MEMBER_SECRET) {
    console.error(
      "Access secrets not found. These are required and must be configured as local variables for user upgrades to work."
    );
    sendErrorResponse(res, "There was an error. Please try again shortly.");
    return;
  }

  if (!(accessTarget in UserRole)) {
    sendErrorResponse(res, "Incorrect upgrade data format.");
    return;
  }

  if (accessTarget === "ADMIN" && accessSecret !== process.env.ADMIN_SECRET) {
    sendErrorResponse(res, "Access denied. Check credentials and try again.");
    return;
  }

  if (accessTarget === "MEMBER" && accessSecret !== process.env.MEMBER_SECRET) {
    sendErrorResponse(res, "Access denied. Check credentials and try again.");
    return;
  }

  if (accessTarget === "BASE") {
    sendErrorResponse(res, "Cannot upgrade to base account.");
    return;
  }

  const upgradedUser = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { role: accessTarget as UserRole },
    select: {
      id: true,
      role: true,
      username: true,
      email: true,
      passwordHash: false,
    },
  });
  if (!upgradedUser) {
    sendErrorResponse(
      res,
      "There was an unknown error while upgrading the user."
    );
    return;
  }
  sendResponse(
    res,
    `User upgraded to ${upgradedUser.role.toLowerCase()}.`,
    upgradedUser
  );
  return;
});

const userController = {
  users_list,
  user_get,
  user_create,
  user_update,
  user_login,
  user_upgrade,
};

export default userController;
