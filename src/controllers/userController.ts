import asyncHandler from "express-async-handler";
import { z } from "zod";
import { iResponseJSON } from "../lib/types";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

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
    const errorResponse: iResponseJSON = {
      success: false,
      message: "Cannot get user. User may not exist.",
    };
    res.json(errorResponse);
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
    const errorResponse: iResponseJSON = {
      success: false,
      message: "No new user data was found. Check request body format.",
    };
    res.json(errorResponse);
    return;
  }
  const validatedData = NewUser.safeParse(newUserData);

  if (!validatedData.success) {
    const errorResponse: iResponseJSON = {
      success: false,
      message: "New user data invalid. Failed to create user.",
      data: { errors: validatedData.error.flatten().fieldErrors },
    };

    res.json(errorResponse);
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

      const jsonResponse: iResponseJSON = {
        success: true,
        message: "User created.",
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      };

      res.json(jsonResponse);
    } catch (error) {
      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          console.log(
            "Unique constraint violation. Username or email already in use."
          );
        }
      }

      next(error);
    }
  });
});

const user_update = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.params.id,
      username: "coolnewname",
      email: "coolnewname@mail.com",
      pass_hash: "aJ2(n!LKn2#b*",
    },
  });
});

const userController = {
  users_list,
  user_get,
  user_create,
  user_update,
};

export default userController;
