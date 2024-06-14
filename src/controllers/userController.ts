import asyncHandler from "express-async-handler";
import {
  UserPublic,
  iResponseJSON,
  iValidatedUserData,
} from "../lib/types/types";
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

const users_list = asyncHandler(async (req, res) => {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  sendResponse(res, "User list retrieved successfully.", allUsers);
});

const user_get = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  const user: UserPublic | null = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
    },
  });
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
      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          passwordHash: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      });

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
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(req.params.id) },
        data: { ...validatedUserData },
        select: {
          id: true,
          email: true,
          username: true,
        },
      });

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
  const responseJSON: iResponseJSON = {
    success: false,
  };

  if (!req.body.data) {
    responseJSON.message = "Login data required.";
    res.json(responseJSON);
    return;
  }

  const validatedData = LoginUserSchema.safeParse(req.body.data);
  if (!validatedData.success) {
    responseJSON.message = "Incorrect login data format.";
    res.json(responseJSON);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { username: validatedData.data.username },
  });
  if (!user) {
    responseJSON.message = "Login failed. User not found.";
    res.json(responseJSON);
    return;
  }

  const match = await bcrypt.compare(
    validatedData.data.password,
    user.passwordHash
  );
  if (!match) {
    responseJSON.message = "Login failed. Incorrect password.";
    res.json(responseJSON);
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

  responseJSON.success = true;
  responseJSON.message = "User logged in with returned token.";
  responseJSON.data = { accessToken };
  res.json(responseJSON);
});

const user_upgrade = asyncHandler(async (req, res) => {
  const responseJSON: iResponseJSON = {
    success: false,
  };

  if (req.user?.id.toString() !== req.params.id) {
    responseJSON.message = "Access denied. You cannot update this user.";
    res.json(responseJSON);
    return;
  }

  if (!req.body.data) {
    responseJSON.message = "Upgrade data required.";
    res.json(responseJSON);
    return;
  }

  const validatedData = UpgradeUserSchema.safeParse(req.body.data);
  if (!validatedData.success) {
    responseJSON.message = "Incorrect upgrade data format.";
    res.json(responseJSON);
    return;
  }

  const { accessTarget, accessSecret } = validatedData.data;

  if (!process.env.ADMIN_SECRET || !process.env.MEMBER_SECRET) {
    (responseJSON.message = "There was an error. Please try again shortly."),
      console.error(
        "Access secrets not found. These are required and must be configured as local variables for user upgrades to work."
      );
    res.json(responseJSON);
    return;
  }

  if (!(accessTarget in UserRole)) {
    responseJSON.message = "Incorrect upgrade data format.";
    res.json(responseJSON);
    return;
  }

  if (accessTarget === "ADMIN" && accessSecret !== process.env.ADMIN_SECRET) {
    responseJSON.message = "Access denied. Check credentials and try again.";
    res.json(responseJSON);
    return;
  }

  if (accessTarget === "MEMBER" && accessSecret !== process.env.MEMBER_SECRET) {
    responseJSON.message = "Access denied. Check credentials and try again.";
    res.json(responseJSON);
    return;
  }

  if (accessTarget === "BASE") {
    responseJSON.message = "Cannot upgrade to base account.";
    res.json(responseJSON);
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
    responseJSON.message =
      "There was an unknown error while upgrading the user.";
    res.json(responseJSON);
    return;
  }
  responseJSON.success = true;
  responseJSON.message = `User upgraded to ${upgradedUser.role.toLowerCase()}.`;
  responseJSON.data = upgradedUser;
  res.json(responseJSON);
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
