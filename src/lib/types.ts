export interface iResponseJSON {
  success: true | false;
  message?: string;
  data?: iUserData | iErrorData | iAccessTokenData;
}

export interface iErrorData {
  errors: Record<string, string[]>;
}

export interface iUserData {
  id: number;
  username: string;
  email: string;
}

export interface iAccessTokenData {
  accessToken: string;
}
