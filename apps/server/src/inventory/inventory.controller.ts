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
  Request,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { 
  CreateInventoryItemDto, 
  UpdateInventoryItemDto, 
  CreateInventoryRequestDto, 
  UpdateInventoryRequestDto,
  CreateInventoryIssuanceDto,
  MarkAsReturnedDto
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, InventoryRequestStatus } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Inventory Items Management
  @Post('items')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async createInventoryItem(@Body() data: CreateInventoryItemDto) {
    return this.inventoryService.createInventoryItem(data);
  }

  @Get('items')
  async findAllInventoryItems(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inventoryService.findAllInventoryItems(pageNum, limitNum);
  }

  @Get('items/search')
  async searchInventoryItems(@Query('q') query: string) {
    return this.inventoryService.searchInventoryItems(query);
  }

  @Get('items/low-stock')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async getLowStockItems() {
    return this.inventoryService.getLowStockItems();
  }

  @Get('items/:id')
  async findInventoryItemById(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findInventoryItemById(id);
  }

  @Put('items/:id')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async updateInventoryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.updateInventoryItem(id, data);
  }

  @Delete('items/:id')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async deleteInventoryItem(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventoryItem(id);
  }

  // Inventory Requests Management
  @Post('requests')
  async createInventoryRequest(
    @Body() data: CreateInventoryRequestDto,
    @Request() req: any,
  ) {
    return this.inventoryService.createInventoryRequest(req.user.id, data);
  }

  @Get('requests')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async findAllInventoryRequests(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: InventoryRequestStatus,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inventoryService.findAllInventoryRequests(pageNum, limitNum, status);
  }

  @Get('requests/my')
  async getUserRequests(@Request() req: any) {
    return this.inventoryService.getUserRequests(req.user.id);
  }

  @Put('requests/:id')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async updateInventoryRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateInventoryRequestDto,
    @Request() req: any,
  ) {
    return this.inventoryService.updateInventoryRequest(id, req.user.id, data);
  }

  // Inventory Issuance Management
  @Post('issuances')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async createInventoryIssuance(
    @Body() data: CreateInventoryIssuanceDto,
    @Request() req: any,
  ) {
    return this.inventoryService.createInventoryIssuance(req.user.id, data);
  }

  @Get('issuances')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async findAllInventoryIssuances(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inventoryService.findAllInventoryIssuances(pageNum, limitNum);
  }

  @Get('issuances/all')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async findAllInventoryIssuancesAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inventoryService.findAllInventoryIssuancesAll(pageNum, limitNum);
  }

  @Put('issuances/:id/return')
  @Roles(UserRole.STUDENT_SERVICE, UserRole.ADMIN)
  async markAsReturned(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: MarkAsReturnedDto,
  ) {
    return this.inventoryService.markAsReturned(id, data.returnNotes);
  }
}
