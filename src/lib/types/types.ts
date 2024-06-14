import { Color, Species, User } from "@prisma/client";

export interface iResponseJSON {
  success: true | false;
  message?: string;
  data?: ResponseData;
}

export type ResponseData =
  | iResponseDataError
  | UserPublic
  | iResponseDataToken
  | UserNoHash
  | UserNoHash[]
  | Color
  | Color[]
  | Species
  | Species[];

export type UserNoHash = Omit<User, "passwordHash">;

export type UserPublic = Omit<
  User,
  "passwordHash" | "role" | "email" | "createdAt" | "updatedAt"
>;

export interface iResponseDataError {
  errors: { [key: string]: string[] | undefined };
}

export interface iResponseDataToken {
  accessToken: string;
}

export interface iValidatedUserData {
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
}
