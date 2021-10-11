import { compare, hash } from 'bcryptjs';

export class AuthHelper {
  static validateEmail(email: string) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  static validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  static hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  static createConfirmUserUrl(token: string) {
    return `http://localhost:3000/confirm-account/${token}`
  }

  static createForgotPasswordUrl(token: string) {
    return `http://localhost:3000/forgot-password/${token}`
  }
}
