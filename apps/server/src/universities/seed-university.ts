import { PrismaService } from '../prisma/prisma.service';

export async function seedUniversity(prisma: PrismaService) {
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

  // Create faculties
  const facultiesData = [
    {
      id: 1,
      name: 'Faculty of Technical Sciences',
      description: 'Leading faculty for engineering and technology education',
      universityId: mainUniversity.id,
      phone: '+381 11 789-1241',
      email: 'ftn@harvox.edu.rs',
      deanName: 'Prof. Dr. Marko Petković',
      deanTitle: 'Dean'
    },
    {
      id: 2,
      name: 'Faculty of Business',
      description: 'Excellence in business education and management',
      universityId: mainUniversity.id,
      phone: '+381 11 789-1242',
      email: 'business@harvox.edu.rs',
      deanName: 'Prof. Dr. Milica Nikolić',
      deanTitle: 'Dean'
    },
    {
      id: 3,
      name: 'Faculty of Applied Ecology "Futura"',
      description: 'Sustainable development and environmental sciences',
      universityId: mainUniversity.id,
      phone: '+381 11 789-1243',
      email: 'ecology@harvox.edu.rs',
      deanName: 'Prof. Dr. Stefan Milosavljević',
      deanTitle: 'Dean'
    },
    {
      id: 4,
      name: 'Faculty of Tourism and Hospitality',
      description: 'Tourism industry and hospitality management education',
      universityId: mainUniversity.id,
      phone: '+381 11 789-1244',
      email: 'tourism@harvox.edu.rs',
      deanName: 'Prof. Dr. Jovana Stojanović',
      deanTitle: 'Dean'
    }
  ];

  for (const facultyData of facultiesData) {
    await prisma.faculty.upsert({
      where: { id: facultyData.id },
      update: facultyData,
      create: facultyData
    });
  }

  console.log('University and faculties seeded:', mainUniversity.name);
  return mainUniversity;
}

// Run seeding if file is called directly
if (require.main === module) {
  const { PrismaClient } = require('@prisma/client');
  const prismaClient = new PrismaClient();
  
  seedUniversity(prismaClient)
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prismaClient.$disconnect();
    });
}
