import { compare, hash } from 'bcryptjs';

export class AuthHelper {
  static validateEmail(email: string) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  static validateInputPassword(password: string) {
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,16}$/;
    return re.test(password);
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
}
