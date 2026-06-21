import { prisma } from "../../database/prisma.js";

export const authRepository = {
  findActiveUserByEmail(email) {
    return prisma.user.findFirst({
      where: {
        email,
        status: "ACTIVE"
      }
    });
  },

  updateLastLogin(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  }
};

