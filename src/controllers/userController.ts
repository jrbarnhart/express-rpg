import asyncHandler from "express-async-handler";
import { z } from "zod";
import { iErrorData, iResponseJSON } from "../lib/types";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const NewUser = z.object({
  email: z
    .string()
    .trim()
    .email({
      message: "Must be a valid email format. Example: user@service.com",
    })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(320, { message: "Email must be at most 320 characters long" }),
  username: z
    .string()
    .trim()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(64, { message: "Username must be at most 64 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/^\S*$/, { message: "Password must not contain spaces" }),
});

const users_list = asyncHandler(async (req, res) => {
  const userCount = await prisma.user.count();
  res.json({ userCount });
});

const user_get = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, passwordHash: false },
  });
  if (!user) {
    const responseJSON: iResponseJSON = {
      success: false,
      message: "Cannot get user. User may not exist.",
    };
    res.json(responseJSON);
  } else {
    const responseJSON: iResponseJSON = {
      success: true,
      data: user,
    };
    res.json(responseJSON);
  }
});

const user_create = asyncHandler(async (req, res, next) => {
  const newUserData = req.body.data;
  if (!newUserData) {
    const responseJSON: iResponseJSON = {
      success: false,
      message: "No new user data was found. Check request body format.",
    };
    res.json(responseJSON);
    return;
  }
  const validatedData = NewUser.safeParse(newUserData);

  if (!validatedData.success) {
    const responseJSON: iResponseJSON = {
      success: false,
      message: "New user data invalid. Failed to create user.",
      data: { errors: validatedData.error.flatten().fieldErrors },
    };

    res.json(responseJSON);
    return;
  }

  bcrypt.hash(validatedData.data.password, 10, async (err, hashedPassword) => {
    if (err) {
      next(err);
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          username: validatedData.data.username,
          email: validatedData.data.email,
          passwordHash: hashedPassword,
        },
      });

      const responseJSON: iResponseJSON = {
        success: true,
        message: "User created.",
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      };

      res.json(responseJSON);
    } catch (error) {
      // Handle Prisma errors
      const responseJSON: iResponseJSON = {
        success: false,
        message: "User creation failed.",
      };
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint error
        if (error.code === "P2002") {
          const meta = error.meta;
          const targetArray = meta?.target;
          if (Array.isArray(targetArray)) {
            const target: string = targetArray[0];
            const errorData: iErrorData = {
              errors: {},
            };
            errorData.errors[target] = [
              `That ${target} is already in use. Please log in or choose another ${target}.`,
            ];
            responseJSON.data = errorData;
          }
        }
      }
      res.json(responseJSON);
    }
  });
});

const user_update = asyncHandler(async (req, res) => {
  res.json({
    success: false,
    message: "NYI",
  });
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

  const data = req.body.data;
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (!user) {
    responseJSON.message = "Login failed. User not found.";
    res.json(responseJSON);
    return;
  }

  const match = await bcrypt.compare(data.password, user.passwordHash);
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

const userController = {
  users_list,
  user_get,
  user_create,
  user_update,
  user_login,
};

export default userController;
