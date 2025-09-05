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
  UseGuards,
  HttpStatus 
} from '@nestjs/common';
import { StudyProgramsService } from './study-programs.service';
import { CreateStudyProgramDto } from './dto/create-study-program.dto';
import { UpdateStudyProgramDto } from './dto/update-study-program.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('study-programs')
export class StudyProgramsController {
  constructor(private readonly studyProgramsService: StudyProgramsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN) 
  create(@Body() createStudyProgramDto: CreateStudyProgramDto) {
    return this.studyProgramsService.create(createStudyProgramDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('facultyId') facultyId?: string,
    @Query('search') search?: string,
    @Query('duration') duration?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const facultyIdNum = facultyId ? parseInt(facultyId, 10) : undefined;
    const durationNum = duration ? parseInt(duration, 10) : undefined;

    return this.studyProgramsService.findAll(pageNum, limitNum, facultyIdNum, search, durationNum);
  }

  @Get('faculty/:facultyId')
  findByFaculty(@Param('facultyId', ParseIntPipe) facultyId: number) {
    return this.studyProgramsService.findByFaculty(facultyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studyProgramsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles(UserRole.ADMIN) 
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateStudyProgramDto: UpdateStudyProgramDto
  ) {
    return this.studyProgramsService.update(id, updateStudyProgramDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studyProgramsService.remove(id);
  }
}
