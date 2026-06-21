import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/common/security/password.js";

const prisma = new PrismaClient();

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@school.local";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

async function main() {
  const passwordHash = await hashPassword(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      status: "ACTIVE",
      passwordHash
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      firstName: "System",
      lastName: "Admin"
    }
  });

  console.log(`Seeded admin user: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

