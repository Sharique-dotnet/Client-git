export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string, minLength: number = 6): boolean {
    return password && password.length >= minLength;
  }

  static isValidUsername(username: string): boolean {
    return username && username.length >= 3;
  }
}
