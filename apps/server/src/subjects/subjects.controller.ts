import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('studyProgramId') studyProgramId?: string,
    @Query('semester') semester?: string,
    @Query('search') search?: string,
    @Query('credits') credits?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const studyProgramIdNum = studyProgramId ? parseInt(studyProgramId, 10) : undefined;
    const semesterNum = semester ? parseInt(semester, 10) : undefined;
    const creditsNum = credits ? parseInt(credits, 10) : undefined;

    return this.subjectsService.findAll(pageNum, limitNum, studyProgramIdNum, semesterNum, search, creditsNum);
  }

  @Get('study-program/:studyProgramId')
  findByStudyProgram(@Param('studyProgramId', ParseIntPipe) studyProgramId: number) {
    return this.subjectsService.findByStudyProgram(studyProgramId);
  }

  @Get('semester/:semester')
  findBySemester(@Param('semester', ParseIntPipe) semester: number) {
    return this.subjectsService.findBySemester(semester);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)  
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSubjectDto: UpdateSubjectDto
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles(UserRole.ADMIN) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.remove(id);
  }
}
