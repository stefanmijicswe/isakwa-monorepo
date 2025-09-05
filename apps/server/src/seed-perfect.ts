import { config } from 'dotenv';
config();

import { PrismaService } from './prisma/prisma.service';

const prisma = new PrismaService();

async function seedPerfectData() {
  console.log('Starting PERFECT seed based on exact schema...');

  try {
    // 1. Country (ima unique name i code)
    console.log('🌍 Creating country...');
    const serbia = await prisma.country.upsert({
      where: { name: 'Serbia' },
      update: {},
      create: {
        name: 'Serbia',
        code: 'RS'
      }
    });

    // 2. State (nema unique name, koristim findFirst)
    console.log('Creating state...');
    let vojvodina = await prisma.state.findFirst({
      where: { name: 'Vojvodina' }
    });
    
    if (!vojvodina) {
      vojvodina = await prisma.state.create({
        data: {
          name: 'Vojvodina',
          countryId: serbia.id
        }
      });
    }

    // 3. City (nema unique name, koristim findFirst)
    console.log('Creating city...');
    let noviSad = await prisma.city.findFirst({
      where: { name: 'Novi Sad' }
    });
    
    if (!noviSad) {
      noviSad = await prisma.city.create({
        data: {
          name: 'Novi Sad',
          zipCode: '21000',
          countryId: serbia.id,
          stateId: vojvodina.id
        }
      });
    }

    // 4. Address (potreban za University i Faculty)
    console.log('Creating address...');
    let mainAddress = await prisma.address.findFirst({
      where: { street: 'Vojvode Putnika' }
    });
    
    if (!mainAddress) {
      mainAddress = await prisma.address.create({
        data: {
          street: 'Vojvode Putnika',
          number: '85',
          cityId: noviSad.id
        }
      });
    }

    // 5. University (nema unique name, koristim findFirst)
    console.log('Creating university...');
    let university = await prisma.university.findFirst({
      where: { name: 'Isakwa University' }
    });
    
    if (!university) {
      university = await prisma.university.create({
        data: {
          name: 'Isakwa University',
          description: 'Leading private university in Serbia.',
          phone: '+381 21 485 2000',
          email: 'info@isakwa.edu',
          website: 'https://isakwa.edu',
          rectorName: 'Prof. Dr. Miloš Radovanović',
          rectorTitle: 'Rector',
          addressId: mainAddress.id
        }
      });
    }

    // 6. Faculty (nema unique name, koristim findFirst)
    console.log('Creating faculties...');
    let facultyIT = await prisma.faculty.findFirst({
      where: { name: 'Faculty of Information Technology' }
    });
    
    if (!facultyIT) {
      facultyIT = await prisma.faculty.create({
        data: {
          universityId: university.id,
          name: 'Faculty of Information Technology',
          description: 'Leading faculty in computer science and IT.',
          phone: '+381 21 485 2100',
          email: 'info@fit.isakwa.edu',
          deanName: 'Prof. Dr. Ana Milosevic',
          deanTitle: 'Dean',
          addressId: mainAddress.id
        }
      });
    }

    let facultyBusiness = await prisma.faculty.findFirst({
      where: { name: 'Faculty of Business Administration' }
    });
    
    if (!facultyBusiness) {
      facultyBusiness = await prisma.faculty.create({
        data: {
          universityId: university.id,
          name: 'Faculty of Business Administration',
          description: 'Excellence in business and management.',
          phone: '+381 21 485 2200',
          email: 'info@fba.isakwa.edu',
          deanName: 'Prof. Dr. Marko Petrovic',
          deanTitle: 'Dean',
          addressId: mainAddress.id
        }
      });
    }

    // 7. Department (nema unique name, koristim findFirst)
    console.log('Creating departments...');
    let deptCS = await prisma.department.findFirst({
      where: { name: 'Department of Computer Science' }
    });
    
    if (!deptCS) {
      deptCS = await prisma.department.create({
        data: {
          name: 'Department of Computer Science',
          facultyId: facultyIT.id
        }
      });
    }

    let deptMgmt = await prisma.department.findFirst({
      where: { name: 'Department of Management' }
    });
    
    if (!deptMgmt) {
      deptMgmt = await prisma.department.create({
        data: {
          name: 'Department of Management',
          facultyId: facultyBusiness.id
        }
      });
    }

    // 8. StudyProgram (ima unique name i code)
    console.log('Creating study programs...');
    const bachelorCS = await prisma.studyProgram.upsert({
      where: { name: 'Bachelor of Computer Science' },
      update: {},
      create: {
        facultyId: facultyIT.id,
        name: 'Bachelor of Computer Science',
        code: 'BCS',
        level: 'BACHELOR',
        description: 'Four-year undergraduate program in computer science.',
        duration: 4,
        directorName: 'Prof. Dr. Petar Nikolić',
        directorTitle: 'Program Director'
      }
    });

    const bachelorBusiness = await prisma.studyProgram.upsert({
      where: { name: 'Bachelor of Business Administration' },
      update: {},
      create: {
        facultyId: facultyBusiness.id,
        name: 'Bachelor of Business Administration',
        code: 'BBA',
        level: 'BACHELOR',
        description: 'Comprehensive business administration program.',
        duration: 4,
        directorName: 'Prof. Dr. Jelena Stojanović',
        directorTitle: 'Program Director'
      }
    });

    // 9. Subject (ima unique code)
    console.log('Creating subjects...');
    await prisma.subject.upsert({
      where: { code: 'CS101' },
      update: {},
      create: {
        name: 'Introduction to Programming',
        code: 'CS101',
        description: 'Basic programming concepts using Python.',
        credits: 8,
        ects: 8,
        semester: 1,
        mandatory: true,
        numberOfLectures: 2,
        numberOfExercises: 4,
        studyProgramId: bachelorCS.id
      }
    });

    await prisma.subject.upsert({
      where: { code: 'CS201' },
      update: {},
      create: {
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        description: 'Fundamental data structures and algorithms.',
        credits: 7,
        ects: 7,
        semester: 2,
        mandatory: true,
        numberOfLectures: 3,
        numberOfExercises: 2,
        studyProgramId: bachelorCS.id
      }
    });

    await prisma.subject.upsert({
      where: { code: 'BUS101' },
      update: {},
      create: {
        name: 'Introduction to Management',
        code: 'BUS101',
        description: 'Basic management principles and practices.',
        credits: 6,
        ects: 6,
        semester: 1,
        mandatory: true,
        numberOfLectures: 3,
        numberOfExercises: 1,
        studyProgramId: bachelorBusiness.id
      }
    });

    console.log('Perfect seed completed successfully!');
    
    return {
      countries: 1,
      states: 1,
      cities: 1,
      addresses: 1,
      universities: 1,
      faculties: 2,
      departments: 2,
      studyPrograms: 2,
      subjects: 3
    };

  } catch (error) {
    console.error('Perfect seed failed:', error);
    throw error;
  }
}

// Export for use in main seed file
export { seedPerfectData };

// Direct execution
if (require.main === module) {
  seedPerfectData()
    .then((result) => {
      console.log('Perfect seed results:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Perfect seed failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
