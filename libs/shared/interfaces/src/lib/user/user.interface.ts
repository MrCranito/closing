export interface User {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  isEmailVerified: boolean;
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Basic = 'Basic',
}
