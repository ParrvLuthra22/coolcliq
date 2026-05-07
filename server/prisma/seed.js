import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding…');

  // Admin
  await prisma.admin.upsert({
    where: { email: 'admin@coolcliq.in' },
    update: {},
    create: {
      email: 'admin@coolcliq.in',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      passwordHash: await bcrypt.hash('admin123', 10),
    },
  });

  // Venues — Bangalore launch set
  const venues = [
    { name: 'Toit Brewpub', address: '298, 100 Feet Rd, Indiranagar', city: 'Bangalore', latitude: 12.9784, longitude: 77.6408 },
    { name: 'The Permit Room', address: 'St. Marks Rd, Ashok Nagar',   city: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
    { name: 'Bob\'s Bar',        address: '12th Main, Indiranagar',     city: 'Bangalore', latitude: 12.9719, longitude: 77.6412 },
    { name: 'Soka',              address: 'Lavelle Rd',                 city: 'Bangalore', latitude: 12.9723, longitude: 77.5982 },
  ];

  for (const v of venues) {
    await prisma.venue.upsert({
      where: { qrSecret: `seed-${v.name}` },
      update: {},
      create: {
        ...v,
        qrSecret: crypto.randomBytes(32).toString('hex'),
        coverImageUrl: null,
        totalTables: 25,
      },
    });
  }

  console.log('✅ Done. Login: admin@coolcliq.in / admin123');
}

main().finally(() => prisma.$disconnect());
