import { PrismaService } from '../prisma/prisma.service';

export async function seedSubjects(prisma: PrismaService) {
  const studyPrograms = await prisma.studyProgram.findMany({
    include: {
      faculty: {
        select: {
          name: true
        }
      }
    }
  });

  const subjectsData = [
    {
      facultyName: 'Faculty of Technical Sciences',
      programName: 'Software Engineering',
      subjects: [
        { name: 'Introduction to Programming', code: 'SE101', credits: 8, semester: 1, lectureHours: 45, exerciseHours: 30, description: 'Basic programming concepts and problem solving' },
        { name: 'Mathematics I', code: 'SE102', credits: 6, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Fundamental mathematical concepts for computer science' },
        { name: 'Computer Systems', code: 'SE103', credits: 6, semester: 1, lectureHours: 30, exerciseHours: 30, description: 'Introduction to computer architecture and systems' },
        { name: 'Object-Oriented Programming', code: 'SE201', credits: 8, semester: 2, lectureHours: 45, exerciseHours: 30, description: 'Object-oriented programming principles and practices' },
        { name: 'Data Structures and Algorithms', code: 'SE202', credits: 7, semester: 2, lectureHours: 45, exerciseHours: 15, description: 'Fundamental data structures and algorithmic techniques' },
        { name: 'Database Systems', code: 'SE301', credits: 7, semester: 3, lectureHours: 45, exerciseHours: 30, description: 'Database design, implementation, and management' },
        { name: 'Web Development', code: 'SE302', credits: 6, semester: 3, lectureHours: 30, exerciseHours: 45, description: 'Modern web development technologies and frameworks' },
        { name: 'Software Engineering', code: 'SE401', credits: 8, semester: 4, lectureHours: 45, exerciseHours: 30, description: 'Software development methodologies and project management' },
        { name: 'Artificial Intelligence', code: 'SE402', credits: 7, semester: 4, lectureHours: 45, exerciseHours: 15, description: 'Introduction to AI concepts and machine learning' }
      ]
    },
    {
      facultyName: 'Faculty of Technical Sciences',
      programName: 'Information Technology',
      subjects: [
        { name: 'IT Fundamentals', code: 'IT101', credits: 6, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Basic concepts of information technology' },
        { name: 'Network Fundamentals', code: 'IT102', credits: 7, semester: 1, lectureHours: 45, exerciseHours: 30, description: 'Computer networking principles and protocols' },
        { name: 'Operating Systems', code: 'IT201', credits: 6, semester: 2, lectureHours: 45, exerciseHours: 15, description: 'Operating system concepts and administration' },
        { name: 'System Administration', code: 'IT301', credits: 8, semester: 3, lectureHours: 30, exerciseHours: 45, description: 'Server and network administration practices' },
        { name: 'Cybersecurity', code: 'IT401', credits: 7, semester: 4, lectureHours: 45, exerciseHours: 30, description: 'Information security principles and practices' }
      ]
    },
    {
      facultyName: 'Faculty of Business',
      programName: 'Management',
      subjects: [
        { name: 'Principles of Management', code: 'MG101', credits: 6, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Fundamental management theories and practices' },
        { name: 'Business Economics', code: 'MG102', credits: 7, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Economic principles in business context' },
        { name: 'Organizational Behavior', code: 'MG201', credits: 6, semester: 2, lectureHours: 45, exerciseHours: 15, description: 'Human behavior in organizational settings' },
        { name: 'Strategic Management', code: 'MG301', credits: 8, semester: 3, lectureHours: 45, exerciseHours: 30, description: 'Strategic planning and competitive advantage' },
        { name: 'Leadership', code: 'MG401', credits: 7, semester: 4, lectureHours: 30, exerciseHours: 30, description: 'Leadership theories and practical applications' }
      ]
    },
    {
      facultyName: 'Faculty of Business',
      programName: 'Marketing',
      subjects: [
        { name: 'Marketing Fundamentals', code: 'MK101', credits: 6, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Basic marketing concepts and strategies' },
        { name: 'Consumer Behavior', code: 'MK201', credits: 6, semester: 2, lectureHours: 45, exerciseHours: 15, description: 'Understanding consumer decision-making processes' },
        { name: 'Digital Marketing', code: 'MK301', credits: 7, semester: 3, lectureHours: 30, exerciseHours: 30, description: 'Online marketing strategies and tools' },
        { name: 'Brand Management', code: 'MK401', credits: 8, semester: 4, lectureHours: 45, exerciseHours: 30, description: 'Building and managing strong brands' }
      ]
    },
    {
      facultyName: 'Faculty of Applied Ecology "Futura"',
      programName: 'Environmental Sciences',
      subjects: [
        { name: 'Environmental Chemistry', code: 'ES101', credits: 7, semester: 1, lectureHours: 45, exerciseHours: 30, description: 'Chemical processes in environmental systems' },
        { name: 'Ecology Principles', code: 'ES102', credits: 6, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Fundamental ecological concepts and relationships' },
        { name: 'Environmental Monitoring', code: 'ES201', credits: 8, semester: 2, lectureHours: 30, exerciseHours: 45, description: 'Methods for environmental assessment and monitoring' },
        { name: 'Climate Change', code: 'ES301', credits: 7, semester: 3, lectureHours: 45, exerciseHours: 15, description: 'Climate science and global environmental change' }
      ]
    },
    {
      facultyName: 'Faculty of Tourism and Hospitality',
      programName: 'Tourism Management',
      subjects: [
        { name: 'Tourism Principles', code: 'TM101', credits: 6, semester: 1, lectureHours: 45, exerciseHours: 15, description: 'Introduction to tourism industry and management' },
        { name: 'Destination Management', code: 'TM201', credits: 7, semester: 2, lectureHours: 45, exerciseHours: 30, description: 'Managing tourism destinations effectively' },
        { name: 'Travel Services', code: 'TM301', credits: 6, semester: 3, lectureHours: 30, exerciseHours: 30, description: 'Travel agency and tour operator management' },
        { name: 'Sustainable Tourism', code: 'TM401', credits: 8, semester: 4, lectureHours: 45, exerciseHours: 30, description: 'Principles of sustainable tourism development' }
      ]
    }
  ];

  for (const facultyData of subjectsData) {
    const studyProgram = studyPrograms.find(sp => 
      sp.name === facultyData.programName && 
      sp.faculty.name === facultyData.facultyName
    );
    
    if (studyProgram) {
      for (const subjectData of facultyData.subjects) {
        const existing = await prisma.subject.findFirst({
          where: {
            code: subjectData.code
          }
        });

        if (existing) {
          await prisma.subject.update({
            where: { id: existing.id },
            data: {
              ...subjectData,
              studyProgramId: studyProgram.id
            }
          });
        } else {
          await prisma.subject.create({
            data: {
              ...subjectData,
              studyProgramId: studyProgram.id
            }
          });
        }
      }
    }
  }
  
  console.log('Subjects seeded successfully');
}
