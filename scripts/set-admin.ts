import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setAdmin() {
  const passwordHash = await bcrypt.hash('nikk3344', 10);

  // 1. Create or update user with username/email 'nikk'
  const adminNikk = await prisma.adminUser.upsert({
    where: { email: 'nikk' },
    update: {
      passwordHash,
      name: 'nikk',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      email: 'nikk',
      passwordHash,
      name: 'nikk',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // 2. Also ensure nikk@punjabroyalsuits.com exists with the same password
  await prisma.adminUser.upsert({
    where: { email: 'nikk@punjabroyalsuits.com' },
    update: {
      passwordHash,
      name: 'nikk',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      email: 'nikk@punjabroyalsuits.com',
      passwordHash,
      name: 'nikk',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin credentials updated successfully:');
  console.log('Username / Email: nikk (or nikk@punjabroyalsuits.com)');
  console.log('Password: nikk3344');
}

setAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
