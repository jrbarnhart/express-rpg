export interface iResponseJSON {
  success: true | false;
  message?: string;
  data?: iUserData | iErrorData;
}

export interface iErrorData {
  errors: Record<string, string[]>;
}

export interface iUserData {
  id: number;
  username: string;
  email: string;
}
