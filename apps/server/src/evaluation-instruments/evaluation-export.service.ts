import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xml2js from 'xml2js';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class EvaluationExportService {
  private readonly logger = new Logger(EvaluationExportService.name);

  constructor(private readonly prisma: PrismaService) {}

  // XML Export
  async exportEvaluationResultsToXML(instrumentId: number): Promise<string> {
    try {
      const instrument = await this.prisma.evaluationInstrument.findUnique({
        where: { id: instrumentId },
        include: {
          subject: {
            include: {
              studyPrograms: {
                include: {
                  // faculty: true, // Not available in SubjectStudyProgram
                },
              },
            },
          },
          submissions: {
            include: {
              student: {
                include: {
                  // user: true, // User include not available
                },
              },
            },
          },
        },
      });

      if (!instrument) {
        throw new BadRequestException(`Evaluation instrument with ID ${instrumentId} not found`);
      }

      const xmlData = {
        evaluationInstrument: {
          id: instrument.id,
          title: instrument.title,
          description: instrument.description,
          type: instrument.type,
          maxPoints: instrument.maxPoints,
          dueDate: instrument.dueDate?.toISOString(),
          subject: {
            id: instrument.subject.id,
            name: instrument.subject.name,
            faculty: {
                             id: 0, // Faculty not available through SubjectStudyProgram
                             name: 'Unknown', // Faculty not available through SubjectStudyProgram
            },
          },
          submissions: {
            submission: instrument.submissions.map(sub => ({
              id: sub.id,
              student: {
                id: sub.student.id,
                indexNumber: 'N/A', // studentIndex not available in User model
                                 firstName: sub.student.firstName,
                                 lastName: sub.student.lastName,
                                 email: sub.student.email,
              },
                             submittedAt: sub.createdAt.toISOString(),
              points: sub.points,
              grade: sub.grade,
              passed: sub.passed,
              feedback: sub.feedback,
              gradedAt: sub.gradedAt?.toISOString(),
            })),
          },
        },
      };

      const builder = new xml2js.Builder({
        rootName: 'evaluationResults',
        headless: true,
        renderOpts: { pretty: true, indent: '  ' },
      });

      return builder.buildObject(xmlData);
    } catch (error) {
      this.logger.error(`Failed to export evaluation results to XML: ${error.message}`);
      throw new BadRequestException('Failed to export evaluation results to XML');
    }
  }

  async importEvaluationResultsFromXML(xmlContent: string): Promise<any> {
    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: true,
      });

      const result = await parser.parseStringPromise(xmlContent);
      
      // Validate XML structure
      if (!result.evaluationResults?.evaluationInstrument) {
        throw new BadRequestException('Invalid XML structure');
      }

      const data = result.evaluationResults.evaluationInstrument;
      
      // Validate required fields
      if (!data.id || !data.title || !data.type || !data.maxPoints) {
        throw new BadRequestException('Missing required fields in XML');
      }

      return data;
    } catch (error) {
      this.logger.error(`Failed to import evaluation results from XML: ${error.message}`);
      throw new BadRequestException('Failed to import evaluation results from XML');
    }
  }

  // PDF Export
  async exportEvaluationResultsToPDF(instrumentId: number): Promise<Buffer> {
    try {
      const instrument = await this.prisma.evaluationInstrument.findUnique({
        where: { id: instrumentId },
        include: {
          subject: {
            include: {
              studyPrograms: {
                include: {
                  // faculty: true, // Not available in SubjectStudyProgram
                },
              },
            },
          },
          submissions: {
            include: {
              student: {
                include: {
                  // user: true, // User include not available
                },
              },
            },
          },
        },
      });

      if (!instrument) {
        throw new BadRequestException(`Evaluation instrument with ID ${instrumentId} not found`);
      }

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));

      // Header
      doc.fontSize(24)
         .text('Evaluation Results Report', { align: 'center' })
         .moveDown(2);

      // Instrument details
      doc.fontSize(16)
         .text('Evaluation Instrument Details')
         .moveDown(1);

      doc.fontSize(12)
         .text(`Title: ${instrument.title}`)
         .text(`Type: ${instrument.type}`)
         .text(`Max Points: ${instrument.maxPoints}`)
         .text(`Subject: ${instrument.subject.name}`)
                   .text(`Faculty: Unknown`) // Faculty not available through SubjectStudyProgram
         .moveDown(2);

      if (instrument.description) {
        doc.text(`Description: ${instrument.description}`)
           .moveDown(2);
      }

      // Submissions table
      doc.fontSize(16)
         .text('Student Submissions')
         .moveDown(1);

      if (instrument.submissions.length === 0) {
        doc.fontSize(12)
           .text('No submissions found for this evaluation instrument.')
           .moveDown(2);
      } else {
        // Table headers
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidths = [80, 120, 80, 80, 80, 100];

        doc.fontSize(10)
           .text('Student', tableLeft, tableTop)
           .text('Index', tableLeft + colWidths[0], tableTop)
           .text('Points', tableLeft + colWidths[0] + colWidths[1], tableTop)
           .text('Grade', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop)
           .text('Status', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop)
           .text('Submitted', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop);

        // Table rows
        let currentY = tableTop + 20;
        instrument.submissions.forEach((submission, index) => {
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }

          doc.fontSize(10)
                           .text(`${submission.student.firstName} ${submission.student.lastName}`, tableLeft, currentY)
             .text('N/A', tableLeft + colWidths[0], currentY) // studentIndex not available
             .text(submission.points?.toString() || 'N/A', tableLeft + colWidths[0] + colWidths[1], currentY)
             .text(submission.grade?.toString() || 'N/A', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], currentY)
             .text(submission.passed ? 'Passed' : 'Failed', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY)
             .text(submission.createdAt.toLocaleDateString(), tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY);

          currentY += 20;
        });

        // Statistics
        doc.addPage();
        doc.fontSize(16)
           .text('Statistics Summary', { align: 'center' })
           .moveDown(2);

        const totalSubmissions = instrument.submissions.length;
        const passedSubmissions = instrument.submissions.filter(s => s.passed).length;
        const averagePoints = totalSubmissions > 0 
          ? instrument.submissions.reduce((sum, s) => sum + (s.points || 0), 0) / totalSubmissions 
          : 0;
        const averageGrade = totalSubmissions > 0 
          ? instrument.submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / totalSubmissions 
          : 0;

        doc.fontSize(12)
           .text(`Total Submissions: ${totalSubmissions}`)
           .text(`Passed: ${passedSubmissions}`)
           .text(`Failed: ${totalSubmissions - passedSubmissions}`)
           .text(`Pass Rate: ${totalSubmissions > 0 ? ((passedSubmissions / totalSubmissions) * 100).toFixed(1) : 0}%`)
           .text(`Average Points: ${averagePoints.toFixed(1)}`)
           .text(`Average Grade: ${averageGrade.toFixed(1)}`)
           .moveDown(2);

        // Footer
        doc.fontSize(10)
           .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      }

      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      });
    } catch (error) {
      this.logger.error(`Failed to export evaluation results to PDF: ${error.message}`);
      throw new BadRequestException('Failed to export evaluation results to PDF');
    }
  }

  // Bulk export for multiple instruments
  async exportBulkEvaluationResultsToXML(subjectId: number): Promise<string> {
    try {
      const instruments = await this.prisma.evaluationInstrument.findMany({
        where: { 
          subjectId,
          isActive: true,
        },
        include: {
          subject: {
            include: {
              studyPrograms: {
                include: {
                  // faculty: true, // Not available in SubjectStudyProgram
                },
              },
            },
          },
          submissions: {
            include: {
              student: {
                include: {
                  // user: true, // User include not available
                },
              },
            },
          },
        },
      });

      if (instruments.length === 0) {
        throw new BadRequestException(`No evaluation instruments found for subject ${subjectId}`);
      }

      const xmlData = {
        subjectEvaluations: {
          subject: {
            id: instruments[0].subject.id,
            name: instruments[0].subject.name,
            faculty: {
                             id: 0, // Faculty not available through SubjectStudyProgram
                             name: 'Unknown', // Faculty not available through SubjectStudyProgram
            },
          },
          evaluationInstruments: {
            instrument: instruments.map(instrument => ({
              id: instrument.id,
              title: instrument.title,
              type: instrument.type,
              maxPoints: instrument.maxPoints,
              submissions: {
                submission: instrument.submissions.map(sub => ({
                  studentId: sub.student.id,
                                     indexNumber: 'N/A', // studentIndex not available in User model
                  points: sub.points,
                  grade: sub.grade,
                  passed: sub.passed,
                })),
              },
            })),
          },
        },
      };

      const builder = new xml2js.Builder({
        rootName: 'bulkEvaluationResults',
        headless: true,
        renderOpts: { pretty: true, indent: '  ' },
      });

      return builder.buildObject(xmlData);
    } catch (error) {
      this.logger.error(`Failed to export bulk evaluation results to XML: ${error.message}`);
      throw new BadRequestException('Failed to export bulk evaluation results to XML');
    }
  }
}
