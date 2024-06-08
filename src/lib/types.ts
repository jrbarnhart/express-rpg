import { ZodError } from "zod";

export interface iResponseJSON {
  success: true | false;
  data?: iUserJSON | iResponseError;
  message?: string;
}

export interface iResponseError {
  errors: ZodError;
}

export interface iUserJSON {
  id: number;
  username: string;
  email: string;
}
