export interface UserSignInPayload {
  email: string;
  password: string;
}

export interface UserSignUpPayload extends UserSignInPayload {
  firstName: string;
  secondName: string;
  username: string;
}
