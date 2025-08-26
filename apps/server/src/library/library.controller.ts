import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryItemDto, UpdateLibraryItemDto, BorrowItemDto, ReturnItemDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('library')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // Library Items Management
  @Post('items')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async createLibraryItem(@Body() data: CreateLibraryItemDto) {
    return this.libraryService.createLibraryItem(data);
  }

  @Get('items')
  async findAllLibraryItems(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.libraryService.findAllLibraryItems(pageNum, limitNum);
  }

  @Get('items/search')
  async searchLibraryItems(@Query('q') query: string) {
    return this.libraryService.searchLibraryItems(query);
  }

  @Get('items/:id')
  async findLibraryItemById(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.findLibraryItemById(id);
  }

  @Put('items/:id')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async updateLibraryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateLibraryItemDto,
  ) {
    return this.libraryService.updateLibraryItem(id, data);
  }

  @Delete('items/:id')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async deleteLibraryItem(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.deleteLibraryItem(id);
  }

  // Borrowing Management
  @Post('borrow')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async borrowItem(@Body() data: BorrowItemDto) {
    return this.libraryService.borrowItem(data);
  }

  @Post('return/:borrowingId')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async returnItem(
    @Param('borrowingId', ParseIntPipe) borrowingId: number,
    @Body() data: ReturnItemDto,
  ) {
    return this.libraryService.returnItem(borrowingId, data);
  }

  @Get('borrowings/student/:studentId')
  async getStudentBorrowings(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.libraryService.getStudentBorrowings(studentId);
  }

  @Get('borrowings/overdue')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async getOverdueItems() {
    return this.libraryService.getOverdueItems();
  }

  @Get('borrowings')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async getAllBorrowings() {
    return this.libraryService.getAllBorrowings();
  }
}
