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
}

export interface iResponseDataToken {
  accessToken: string;
}
