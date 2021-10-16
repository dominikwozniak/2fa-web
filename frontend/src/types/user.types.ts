export interface UserSignInPayload {
  email: string;
  password: string;
  code?: string;
}

export interface UserSignUpPayload extends UserSignInPayload {
  firstName: string;
  lastName: string;
  twoFactorEnabled: boolean;
}
