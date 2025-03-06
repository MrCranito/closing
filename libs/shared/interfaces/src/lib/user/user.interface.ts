export interface User {
  id?: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  isEmailVerified: boolean;
}

export enum UserRoleEnum {
  Admin = 'admin',
  Moderator = 'moderator',
  Viewer = 'viewer',
}
