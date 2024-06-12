import { UserRole } from "@prisma/client";

export interface iResponseJSON {
  success: true | false;
  message?: string;
  data?: iResponseDataUser | iResponseDataError | iResponseDataToken;
}

export interface iResponseDataError {
  errors: Record<string, string[]>;
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
