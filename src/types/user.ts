import { Profile } from ".";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  profiles: Profile[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}