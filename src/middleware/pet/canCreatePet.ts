import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma/prisma";
import sendErrorResponse from "../../lib/controllerUtils/sendErrorResponse";

const canCreatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(
      new Error(
        "Request user object not found. Ensure canCreatePet middleware is called after auth middleware."
      )
    );
  }

  const userWithPets = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { pets: true },
  });

  if (!userWithPets) {
    sendErrorResponse(res, "Cannot create pet. User not found.");
    return;
  }

  const userPetCount = userWithPets?.pets.length;

  // Users can always create their first pet
  if (userPetCount === 0) {
    return next();
  }

  sendErrorResponse(res, "This user cannot create a pet right now.");
};

export default canCreatePet;
