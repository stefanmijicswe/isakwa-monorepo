import { 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('universities')
@UseGuards(JwtAuthGuard)
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  findAll() {
    return this.universitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.universitiesService.findOne(id);
  }

  @Get(':id/faculties')
  getUniversityWithFaculties(@Param('id', ParseIntPipe) id: number) {
    return this.universitiesService.getUniversityWithFaculties(id);
  }

  // Endpoint za dobijanje glavnog univerziteta (predefinisan)
  @Get('main/info')
  getMainUniversity() {
    return this.universitiesService.getMainUniversity();
  }
}
