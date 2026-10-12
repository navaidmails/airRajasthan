"use server";

import { AuthService } from "./auth-service";
import { LoginInput, RegisterInput } from "./validation";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function loginAction(data: LoginInput) {
  try {
    const result = await AuthService.login(data);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, user: result.session };
  } catch (err: any) {
    return { success: false, error: err.message || "Login failed" };
  }
}

export async function registerAction(data: RegisterInput) {
  try {
    const result = await AuthService.register(data);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, user: result.session };
  } catch (err: any) {
    return { success: false, error: err.message || "Registration failed" };
  }
}

export async function logoutAction() {
  await AuthService.logout();
  return { success: true };
}

export async function updateUserRoleAction(userId: string, newRole: Role) {
  try {
    const session = await AuthService.requireAuth();
    await AuthService.updateRole(session, userId, newRole);
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update role" };
  }
}
