import { Color, UserRole } from "@prisma/client";

export interface iResponseJSON {
  success: true | false;
  message?: string;
  data?: ResponseData;
}

export type ResponseData =
  | iResponseDataError
  | iResponseDataUser
  | iResponseDataToken
  | Color
  | iResponseDataColorList;

export interface iResponseDataError {
  errors: { [key: string]: string[] | undefined };
}

export interface iResponseDataUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface iResponseDataToken {
  accessToken: string;
}

export interface iValidatedUserData {
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
}

export interface iResponseDataColorList {
  colors: string[];
}
