import { PrismaService } from '../prisma/prisma.service';
import { EvaluationType } from '@prisma/client';

export async function seedEvaluationInstruments(prisma: PrismaService) {
  console.log('Seeding evaluation instruments...');

  // Create evaluation instruments for existing subjects
  const subjects = await prisma.subject.findMany({ take: 5 });
  
  for (const subject of subjects) {
    // Create different types of evaluation instruments
    const instruments = [
      {
        title: 'Midterm Exam',
        description: 'Comprehensive test covering first half of the course',
        type: EvaluationType.MIDTERM,
        maxPoints: 100,
        dueDate: new Date('2024-10-15'),
      },
      {
        title: 'Final Project',
        description: 'Individual or group project demonstrating course knowledge',
        type: EvaluationType.PROJECT,
        maxPoints: 150,
        dueDate: new Date('2024-12-20'),
      },
      {
        title: 'Weekly Quiz',
        description: 'Short quiz to test understanding of weekly material',
        type: EvaluationType.QUIZ,
        maxPoints: 20,
        dueDate: new Date('2024-09-30'),
      },
      {
        title: 'Laboratory Assignment',
        description: 'Practical hands-on laboratory work',
        type: EvaluationType.LABORATORY,
        maxPoints: 50,
        dueDate: new Date('2024-11-15'),
      },
      {
        title: 'Presentation',
        description: 'Oral presentation on selected topic',
        type: EvaluationType.PRESENTATION,
        maxPoints: 30,
        dueDate: new Date('2024-12-10'),
      },
    ];

    for (const instrument of instruments) {
      await prisma.evaluationInstrument.create({
        data: {
          subjectId: subject.id,
          ...instrument,
          isActive: true,
        },
      });
    }

    console.log(`Created evaluation instruments for ${subject.name}`);
  }

  console.log('Evaluation instruments seeding completed!');
}
