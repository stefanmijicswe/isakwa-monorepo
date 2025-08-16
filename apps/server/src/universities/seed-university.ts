import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedUniversity() {
  // First create city
  const city = await prisma.city.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Belgrade',
      zipCode: '11000'
    },
  });

  // Then create address
  const address = await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      street: 'Knez Mihailova',
      number: '42',
      cityId: city.id
    },
  });

  // Create main university (static data) with address
  const mainUniversity = await prisma.university.upsert({
    where: { id: 1 },
    update: {
      description: 'Leading institution in innovation and technology, dedicated to academic excellence and professional education of students.',
      phone: '+381 11 789-1234',
      email: 'info@harvox.edu.rs',
      website: 'https://www.harvox.edu.rs',
      rectorName: 'Prof. Dr. Ana Stevanovic',
      rectorTitle: 'Rector',
      addressId: address.id
    },
    create: {
      id: 1,
      name: 'Harvox University',
      description: 'Leading institution in innovation and technology, dedicated to academic excellence and professional education of students.',
      phone: '+381 11 789-1234',
      email: 'info@harvox.edu.rs',
      website: 'https://www.harvox.edu.rs',
      rectorName: 'Prof. Dr. Ana Stevanovic',
      rectorTitle: 'Rector',
      addressId: address.id
    },
  });

  console.log('University seeded:', mainUniversity.name);
  return mainUniversity;
}

// Run seeding if file is called directly
if (require.main === module) {
  seedUniversity()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
