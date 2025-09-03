import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  ParseIntPipe,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EvaluationInstrumentsService } from './evaluation-instruments.service';
import { EvaluationExportService } from './evaluation-export.service';
import { 
  CreateEvaluationInstrumentDto, 
  UpdateEvaluationInstrumentDto,
  CreateEvaluationSubmissionDto,
  UpdateEvaluationSubmissionDto
} from './dto';
import { QueryEvaluationInstrumentsDto, QueryEvaluationSubmissionsDto } from './dto/query-evaluation-instruments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('evaluation-instruments')
export class EvaluationInstrumentsController {
  private readonly logger = new Logger(EvaluationInstrumentsController.name);

  constructor(
    private readonly evaluationInstrumentsService: EvaluationInstrumentsService,
    private readonly evaluationExportService: EvaluationExportService,
  ) {}

  // Public endpoint for testing
  @Get('test')
  async testEndpoint() {
    return { message: 'Evaluation Instruments module is working!', timestamp: new Date().toISOString() };
  }

  // Protected endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  // Evaluation Instruments endpoints
  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async createEvaluationInstrument(@Body() createDto: CreateEvaluationInstrumentDto) {
    this.logger.log(`Creating evaluation instrument: ${createDto.title}`);
    return this.evaluationInstrumentsService.createEvaluationInstrument(createDto);
  }

  @Get()
  async findAllEvaluationInstruments(
    @Query('subjectId') subjectId?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: string,
  ) {
    // Safe parsing with validation - ignore any validation errors
    let parsedSubjectId: number | undefined;
    let parsedIsActive: boolean | undefined;
    
    try {
      parsedSubjectId = subjectId && !isNaN(parseInt(subjectId, 10)) ? parseInt(subjectId, 10) : undefined;
    } catch (e) {
      parsedSubjectId = undefined;
    }
    
    try {
      parsedIsActive = isActive ? isActive === 'true' : undefined;
    } catch (e) {
      parsedIsActive = undefined;
    }
    
    return this.evaluationInstrumentsService.findAllEvaluationInstruments(
      parsedSubjectId,
      type as any,
      parsedIsActive,
    );
  }

  // Evaluation Submissions endpoints (MUST be before :id routes)
  @Get('submissions')
  async findAllEvaluationSubmissionsNew(
    @Query() query: QueryEvaluationSubmissionsDto,
  ) {
    this.logger.log('Getting all submissions - new endpoint');
    
    try {
      // Parse optional parameters safely from query DTO
      let parsedInstrumentId: number | undefined;
      let parsedStudentId: number | undefined;
      let parsedPassed: boolean | undefined;
      
      try {
        parsedInstrumentId = query.instrumentId && !isNaN(parseInt(query.instrumentId, 10)) ? parseInt(query.instrumentId, 10) : undefined;
      } catch (e) {
        parsedInstrumentId = undefined;
      }
      
      try {
        parsedStudentId = query.studentId && !isNaN(parseInt(query.studentId, 10)) ? parseInt(query.studentId, 10) : undefined;
      } catch (e) {
        parsedStudentId = undefined;
      }
      
      try {
        parsedPassed = query.passed ? query.passed === 'true' : undefined;
      } catch (e) {
        parsedPassed = undefined;
      }
      
      const submissions = await this.evaluationInstrumentsService.findAllEvaluationSubmissions(
        parsedInstrumentId,
        parsedStudentId,
        parsedPassed
      );
      this.logger.log(`Service returned ${submissions.length} submissions`);
      return submissions;
    } catch (error) {
      this.logger.error('Error getting submissions:', error);
      return [];
    }
  }

  @Post('submissions')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async createEvaluationSubmission(@Body() createDto: CreateEvaluationSubmissionDto) {
    this.logger.log(`Creating evaluation submission for student: ${createDto.studentId}`);
    return this.evaluationInstrumentsService.createEvaluationSubmission(createDto);
  }

  @Get('submissions/:id')
  async findEvaluationSubmissionById(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationInstrumentsService.findEvaluationSubmissionById(id);
  }

  @Patch('submissions/:id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async updateEvaluationSubmission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEvaluationSubmissionDto,
  ) {
    this.logger.log(`Updating evaluation submission: ${id}`);
    return this.evaluationInstrumentsService.updateEvaluationSubmission(id, updateDto);
  }

  @Delete('submissions/:id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async deleteEvaluationSubmission(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Deleting evaluation submission: ${id}`);
    return this.evaluationInstrumentsService.deleteEvaluationSubmission(id);
  }

  // Evaluation Instruments endpoints with :id (MUST be after specific routes)
  @Get(':id')
  async findEvaluationInstrumentById(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationInstrumentsService.findEvaluationInstrumentById(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async updateEvaluationInstrument(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEvaluationInstrumentDto,
  ) {
    this.logger.log(`Updating evaluation instrument: ${id}`);
    return this.evaluationInstrumentsService.updateEvaluationInstrument(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async deleteEvaluationInstrument(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Deleting evaluation instrument: ${id}`);
    return this.evaluationInstrumentsService.deleteEvaluationInstrument(id);
  }

  // Statistics and reporting endpoints
  @Get(':id/stats')
  async getEvaluationInstrumentStats(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationInstrumentsService.getEvaluationInstrumentStats(id);
  }

  @Get('student/:studentId/history')
  async getStudentEvaluationHistory(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.evaluationInstrumentsService.getStudentEvaluationHistory(studentId);
  }

  // Export endpoints
  @Get(':id/export/xml')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async exportEvaluationResultsToXML(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const xmlContent = await this.evaluationExportService.exportEvaluationResultsToXML(id);
      
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename="evaluation-results-${id}.xml"`);
      res.status(HttpStatus.OK).send(xmlContent);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Get(':id/export/pdf')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async exportEvaluationResultsToPDF(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.evaluationExportService.exportEvaluationResultsToPDF(id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="evaluation-results-${id}.pdf"`);
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Get('subject/:subjectId/export/xml')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async exportBulkEvaluationResultsToXML(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Res() res: Response,
  ) {
    try {
      const xmlContent = await this.evaluationExportService.exportBulkEvaluationResultsToXML(subjectId);
      
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename="subject-evaluations-${subjectId}.xml"`);
      res.status(HttpStatus.OK).send(xmlContent);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('import/xml')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async importEvaluationResultsFromXML(@Body('xmlContent') xmlContent: string) {
    return this.evaluationExportService.importEvaluationResultsFromXML(xmlContent);
  }
}
