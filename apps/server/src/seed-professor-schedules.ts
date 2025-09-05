import { PrismaClient, TeachingType, SemesterType } from '@prisma/client'

const prisma = new PrismaClient()

const scheduleData = [
  {
    subjectCode: 'CS101',
    subjectName: 'Data Structures and Algorithms',
    lectures: [
      {
        week: 1,
        topic: 'Course Introduction and IT Overview',
        description: 'Introduction to the course, syllabus overview, and basic concepts of information technologies',
        duration: '90 min',
        room: 'Room 301'
      },
      {
        week: 2,
        topic: 'Computer Systems and Hardware',
        description: 'Understanding computer architecture, CPU, memory, storage devices, and input/output systems',
        duration: '90 min',
        room: 'Room 301'
      },
      {
        week: 3,
        topic: 'Operating Systems Fundamentals',
        description: 'Introduction to operating systems, file systems, process management, and system security',
        duration: '90 min',
        room: 'Room 301'
      },
      {
        week: 4,
        topic: 'Network Technologies',
        description: 'Basic networking concepts, TCP/IP, internet protocols, and network security basics',
        duration: '90 min',
        room: 'Room 301'
      }
    ],
    practice: [
      {
        week: 1,
        topic: 'Lab Setup and Basic Computer Operations',
        description: 'Setting up lab environment, basic computer operations, file management exercises',
        duration: '90 min',
        room: 'Lab 205'
      },
      {
        week: 2,
        topic: 'Hardware Identification Exercise',
        description: 'Hands-on identification of computer components, assembly/disassembly exercise',
        duration: '90 min',
        room: 'Lab 205'
      },
      {
        week: 3,
        topic: 'Operating System Installation and Configuration',
        description: 'Installing and configuring different operating systems, user management exercises',
        duration: '90 min',
        room: 'Lab 205'
      }
    ]
  },
  {
    subjectCode: 'CS201',
    subjectName: 'Database Systems',
    lectures: [
      {
        week: 1,
        topic: 'Introduction to Programming',
        description: 'Basic programming concepts, algorithms, flowcharts, and pseudocode',
        duration: '90 min',
        room: 'Room 302'
      },
      {
        week: 2,
        topic: 'Variables and Data Types',
        description: 'Understanding variables, primitive data types, operators, and expressions',
        duration: '90 min',
        room: 'Room 302'
      },
      {
        week: 3,
        topic: 'Control Structures',
        description: 'Conditional statements, loops, and decision-making structures in programming',
        duration: '90 min',
        room: 'Room 302'
      }
    ],
    practice: [
      {
        week: 1,
        topic: 'Development Environment Setup',
        description: 'Installing IDE, writing first program, understanding compiler and interpreter',
        duration: '90 min',
        room: 'Lab 203'
      },
      {
        week: 2,
        topic: 'Basic Programming Exercises',
        description: 'Simple variable exercises, arithmetic operations, input/output programs',
        duration: '90 min',
        room: 'Lab 203'
      }
    ]
  },
  {
    subjectCode: 'CS301',
    subjectName: 'Web Development',
    lectures: [
      {
        week: 1,
        topic: 'Web Development Introduction',
        description: 'Overview of web technologies, client-server architecture, HTTP protocol basics',
        duration: '90 min',
        room: 'Room 304'
      },
      {
        week: 2,
        topic: 'HTML and CSS Fundamentals',
        description: 'HTML structure, semantic elements, CSS styling, responsive design principles',
        duration: '90 min',
        room: 'Room 304'
      }
    ],
    practice: [
      {
        week: 1,
        topic: 'Web Development Environment Setup',
        description: 'Setting up code editor, browser dev tools, creating first HTML page',
        duration: '90 min',
        room: 'Lab 201'
      }
    ]
  }
]

export async function seedProfessorSchedules() {
  console.log('Seeding professor schedules...')

  try {
    // Find the professor user (john.smith@isakwa.edu)
    const professor = await prisma.user.findFirst({
      where: { email: 'john.smith@isakwa.edu' }
    })

    if (!professor) {
      console.error('Professor not found! Run seed-professor-syllabi.ts first')
      return
    }

    console.log('Found professor:', professor.email)

    // Process each schedule
    for (const scheduleItem of scheduleData) {
      console.log(`Processing schedule for ${scheduleItem.subjectCode}...`)

      // Find the subject
      const subject = await prisma.subject.findFirst({
        where: { code: scheduleItem.subjectCode }
      })

      if (!subject) {
        console.warn(`Subject ${scheduleItem.subjectCode} not found, skipping...`)
        continue
      }

      // Check if schedule already exists for this subject
      const existingSchedule = await prisma.courseSchedule.findFirst({
        where: {
          subjectId: subject.id,
          academicYear: '2024/2025',
          createdBy: professor.id
        }
      })

      if (existingSchedule) {
        console.log(`Schedule for ${scheduleItem.subjectCode} already exists, skipping...`)
        continue
      }

      // Create the schedule
      const schedule = await prisma.courseSchedule.create({
        data: {
          subjectId: subject.id,
          academicYear: '2024/2025',
          semesterType: SemesterType.WINTER, // Default to WINTER
          createdBy: professor.id,
          isActive: true,
          sessions: {
            create: [
              // Add lectures
              ...scheduleItem.lectures.map((lecture, index) => ({
                title: lecture.topic,
                description: lecture.description,
                sessionType: TeachingType.LECTURE,
                dayOfWeek: 1, // Monday
                startTime: '09:00',
                endTime: '10:30',
                room: lecture.room,
                createdBy: professor.id
              })),
              // Add practice sessions
              ...scheduleItem.practice.map((practice, index) => ({
                title: practice.topic,
                description: practice.description,
                sessionType: TeachingType.EXERCISE, // Use EXERCISE instead of PRACTICE
                dayOfWeek: 3, // Wednesday
                startTime: '11:00',
                endTime: '12:30',
                room: practice.room,
                createdBy: professor.id
              }))
            ]
          }
        },
        include: {
          sessions: true,
          subject: true
        }
      })

      console.log(`Created schedule for ${scheduleItem.subjectCode} with ${schedule.sessions?.length || 0} sessions`)
    }

    console.log('Successfully seeded professor schedules!')

  } catch (error) {
    console.error('Error seeding professor schedules:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  await seedProfessorSchedules()
}

if (require.main === module) {
  main()
}
