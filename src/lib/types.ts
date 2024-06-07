export interface iResponseJSON {
  success: true | false;
  data?: iUserJSON;
  message?: string;
}

export interface iUserJSON {
  id: number;
  username: string;
  email: string;
}
