import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { EvaluationType } from '@prisma/client';

export async function seedEvaluationInstruments(prisma: PrismaService) {
  const logger = new Logger('SeedEvaluationInstruments');

  try {
    logger.log('Starting to seed evaluation instruments...');

    // Get some subjects to assign evaluation instruments to
    const subjects = await prisma.subject.findMany({
      take: 5,
      include: {
        study_programs: {
          include: {
            faculty: true,
          },
        },
      },
    });

    if (subjects.length === 0) {
      logger.warn('No subjects found. Skipping evaluation instruments seeding.');
      return;
    }

    const evaluationInstruments = [
      {
        title: 'Midterm Exam - Programming Fundamentals',
        description: 'Comprehensive test covering basic programming concepts, algorithms, and data structures.',
        type: EvaluationType.MIDTERM,
        maxPoints: 100,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subjectId: subjects[0]?.id,
      },
      {
        title: 'Final Project - Web Application',
        description: 'Build a complete web application using modern technologies. Include documentation and presentation.',
        type: EvaluationType.PROJECT,
        maxPoints: 150,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        subjectId: subjects[0]?.id,
      },
      {
        title: 'Laboratory Assignment 1 - Database Design',
        description: 'Design and implement a database schema for a student management system.',
        type: EvaluationType.LABORATORY,
        maxPoints: 50,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        subjectId: subjects[1]?.id,
      },
      {
        title: 'Quiz - Business Ethics',
        description: 'Multiple choice questions covering ethical principles in business decision making.',
        type: EvaluationType.QUIZ,
        maxPoints: 25,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        subjectId: subjects[2]?.id,
      },
      {
        title: 'Assignment - Tourism Marketing Strategy',
        description: 'Develop a comprehensive marketing strategy for a tourism destination.',
        type: EvaluationType.ASSIGNMENT,
        maxPoints: 75,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        subjectId: subjects[3]?.id,
      },
      {
        title: 'Presentation - Research Findings',
        description: 'Present your research findings on contemporary information technologies.',
        type: EvaluationType.PRESENTATION,
        maxPoints: 40,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        subjectId: subjects[4]?.id,
      },
      {
        title: 'Final Exam - Advanced Mathematics',
        description: 'Comprehensive final examination covering all course material.',
        type: EvaluationType.FINAL,
        maxPoints: 200,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        subjectId: subjects[0]?.id,
      },
    ];

    for (const instrument of evaluationInstruments) {
      if (instrument.subjectId) {
        await prisma.evaluationInstrument.upsert({
          where: {
            id: 0, // This will never match, so it will create new
          },
          update: {},
          create: instrument,
        });
      }
    }

    logger.log(`Successfully seeded ${evaluationInstruments.length} evaluation instruments`);

    // Create some sample submissions
    const students = await prisma.studentProfile.findMany({
      take: 3,
      include: {
        user: true,
      },
    });

    const createdInstruments = await prisma.evaluationInstrument.findMany({
      take: 3,
    });

    if (students.length > 0 && createdInstruments.length > 0) {
      const submissions = [
        {
          instrumentId: createdInstruments[0].id,
          studentId: students[0].id,
          points: 85,
          grade: 8,
          passed: true,
          feedback: 'Good work! Well-structured code with clear logic.',
          gradedAt: new Date(),
          gradedBy: 1, // Assuming user ID 1 is a professor
        },
        {
          instrumentId: createdInstruments[0].id,
          studentId: students[1].id,
          points: 92,
          grade: 9,
          passed: true,
          feedback: 'Excellent work! Very thorough understanding of concepts.',
          gradedAt: new Date(),
          gradedBy: 1,
        },
        {
          instrumentId: createdInstruments[1].id,
          studentId: students[0].id,
          points: 140,
          grade: 9,
          passed: true,
          feedback: 'Outstanding project! Professional quality work.',
          gradedAt: new Date(),
          gradedBy: 1,
        },
      ];

      for (const submission of submissions) {
        await prisma.evaluationSubmission.upsert({
          where: {
            id: 0, // This will never match, so it will create new
          },
          update: {},
          create: submission,
        });
      }

      logger.log(`Successfully seeded ${submissions.length} evaluation submissions`);
    }

  } catch (error) {
    logger.error('Error seeding evaluation instruments:', error);
    throw error;
  }
}
