import { Role } from "@prisma/client";

export type UserRole = Role;

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
}
