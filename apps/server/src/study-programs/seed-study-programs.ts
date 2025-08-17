import { PrismaService } from '../prisma/prisma.service';

export async function seedStudyPrograms(prisma: PrismaService) {
  const faculties = await prisma.faculty.findMany({
    select: { id: true, name: true }
  });

  const studyProgramsData = [
    {
      facultyName: 'Faculty of Technical Sciences',
      programs: [
        {
          name: 'Software Engineering',
          description: 'Comprehensive program covering software development, algorithms, and system design',
          duration: 4,
          directorName: 'Dr. Marko Petrović',
          directorTitle: 'Professor'
        },
        {
          name: 'Information Technology',
          description: 'Focus on IT infrastructure, networking, and system administration',
          duration: 3,
          directorName: 'Dr. Ana Stanković',
          directorTitle: 'Associate Professor'
        },
        {
          name: 'Information Systems Engineering',
          description: 'Business-oriented approach to information systems and enterprise solutions',
          duration: 4,
          directorName: 'Dr. Nikola Jovanović',
          directorTitle: 'Professor'
        }
      ]
    },
    {
      facultyName: 'Faculty of Business',
      programs: [
        {
          name: 'Management',
          description: 'Strategic management, organizational behavior, and leadership skills',
          duration: 4,
          directorName: 'Dr. Milica Đorđević',
          directorTitle: 'Professor'
        },
        {
          name: 'Marketing',
          description: 'Digital marketing, consumer behavior, and brand management',
          duration: 3,
          directorName: 'Dr. Stefan Milosavljević',
          directorTitle: 'Associate Professor'
        },
        {
          name: 'Finance and Banking',
          description: 'Financial analysis, investment strategies, and banking operations',
          duration: 4,
          directorName: 'Dr. Jelena Nikolić',
          directorTitle: 'Professor'
        }
      ]
    },
    {
      facultyName: 'Faculty of Applied Ecology "Futura"',
      programs: [
        {
          name: 'Environmental Sciences',
          description: 'Environmental protection, sustainability, and ecological research',
          duration: 4,
          directorName: 'Dr. Miloš Vasić',
          directorTitle: 'Professor'
        },
        {
          name: 'Sustainable Development',
          description: 'Green technologies, renewable energy, and sustainable business practices',
          duration: 3,
          directorName: 'Dr. Tijana Radović',
          directorTitle: 'Associate Professor'
        },
        {
          name: 'Environmental Management',
          description: 'Environmental policy, impact assessment, and regulatory compliance',
          duration: 2,
          directorName: 'Dr. Aleksandar Popović',
          directorTitle: 'Professor'
        }
      ]
    },
    {
      facultyName: 'Faculty of Tourism and Hospitality',
      programs: [
        {
          name: 'Tourism Management',
          description: 'Tourism industry operations, destination management, and travel services',
          duration: 4,
          directorName: 'Dr. Marija Stojanović',
          directorTitle: 'Professor'
        },
        {
          name: 'Hotel Management',
          description: 'Hotel operations, hospitality services, and guest experience management',
          duration: 3,
          directorName: 'Dr. Petar Milenković',
          directorTitle: 'Associate Professor'
        },
        {
          name: 'Event Management',
          description: 'Event planning, conference management, and entertainment industry',
          duration: 3,
          directorName: 'Dr. Jovana Ristić',
          directorTitle: 'Assistant Professor'
        }
      ]
    }
  ];

  for (const facultyData of studyProgramsData) {
    const faculty = faculties.find(f => f.name === facultyData.facultyName);
    
    if (faculty) {
      for (const programData of facultyData.programs) {
        await prisma.studyProgram.upsert({
          where: {
            facultyId_name: {
              facultyId: faculty.id,
              name: programData.name
            }
          },
          update: programData,
          create: {
            ...programData,
            facultyId: faculty.id
          }
        });
      }
    }
  }
  
  console.log('Study programs seeded successfully');
}
