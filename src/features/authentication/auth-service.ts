import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { LoginInput, RegisterInput, LoginSchema, RegisterSchema } from "./validation";
import { AuthSession } from "./types";
import { createSessionCookie, getSession, clearSessionCookie } from "./session";

export class AuthService {
  static async login(data: LoginInput): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    const validated = LoginSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" };
    }

    const user = await prisma.user.findUnique({
      where: { email: validated.data.email.toLowerCase().trim() },
    });

    if (!user) {
      return { success: false, error: "Invalid credentials. Please verify your email and password." };
    }

    const passwordMatch = await bcrypt.compare(validated.data.password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials. Please verify your email and password." };
    }

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await createSessionCookie(session);

    return { success: true, session };
  }

  static async register(data: RegisterInput): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    const validated = RegisterSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" };
    }

    const email = validated.data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "An account with this corporate email address already exists." };
    }

    const passwordHash = await bcrypt.hash(validated.data.password, 10);

    // SECURITY: Always enforce Role.USER for public registration. Never trust client input.
    const user = await prisma.user.create({
      data: {
        email,
        name: validated.data.name.trim(),
        passwordHash,
        role: Role.USER,
      },
    });

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await createSessionCookie(session);

    return { success: true, session };
  }

  static async logout(): Promise<void> {
    await clearSessionCookie();
  }

  static async getCurrentSession(): Promise<AuthSession | null> {
    return await getSession();
  }

  static async requireAuth(): Promise<AuthSession> {
    const session = await getSession();
    if (!session) {
      throw new Error("UNAUTHORIZED");
    }
    return session;
  }

  static async requireRole(allowedRoles: Role[]): Promise<AuthSession> {
    const session = await this.requireAuth();
    if (!allowedRoles.includes(session.role)) {
      throw new Error("FORBIDDEN");
    }
    return session;
  }

  static async getAllUsers(currentAdminSession: AuthSession) {
    if (currentAdminSession.role !== Role.ADMIN) {
      throw new Error("FORBIDDEN: Only administrators can view users list.");
    }

    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            assignedEnquiries: true,
            customerEnquiries: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateRole(currentAdminSession: AuthSession, targetUserId: string, newRole: Role) {
    if (currentAdminSession.role !== Role.ADMIN) {
      throw new Error("FORBIDDEN: Only administrators can update roles.");
    }

    if (currentAdminSession.userId === targetUserId && newRole !== Role.ADMIN) {
      throw new Error("Action denied: You cannot remove Administrator rights from your own account.");
    }

    return await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}
