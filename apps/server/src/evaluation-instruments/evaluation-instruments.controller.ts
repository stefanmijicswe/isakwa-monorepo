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
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
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
    const parsedSubjectId = subjectId ? parseInt(subjectId, 10) : undefined;
    const parsedIsActive = isActive ? isActive === 'true' : undefined;
    
    return this.evaluationInstrumentsService.findAllEvaluationInstruments(
      parsedSubjectId,
      type as any,
      parsedIsActive,
    );
  }

  @Get(':id')
  async findEvaluationInstrumentById(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationInstrumentsService.findEvaluationInstrumentById(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async updateEvaluationInstrument(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEvaluationInstrumentDto,
  ) {
    this.logger.log(`Updating evaluation instrument: ${id}`);
    return this.evaluationInstrumentsService.updateEvaluationInstrument(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async deleteEvaluationInstrument(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Deleting evaluation instrument: ${id}`);
    return this.evaluationInstrumentsService.deleteEvaluationInstrument(id);
  }

  // Evaluation Submissions endpoints
  @Post('submissions')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async createEvaluationSubmission(@Body() createDto: CreateEvaluationSubmissionDto) {
    this.logger.log(`Creating evaluation submission for student: ${createDto.studentId}`);
    return this.evaluationInstrumentsService.createEvaluationSubmission(createDto);
  }

  @Get('submissions')
  async findAllEvaluationSubmissions(
    @Query('instrumentId') instrumentId?: string,
    @Query('studentId') studentId?: string,
    @Query('passed') passed?: string,
  ) {
    const parsedInstrumentId = instrumentId ? parseInt(instrumentId, 10) : undefined;
    const parsedStudentId = studentId ? parseInt(studentId, 10) : undefined;
    const parsedPassed = passed ? passed === 'true' : undefined;
    
    return this.evaluationInstrumentsService.findAllEvaluationSubmissions(
      parsedInstrumentId,
      parsedStudentId,
      parsedPassed,
    );
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
