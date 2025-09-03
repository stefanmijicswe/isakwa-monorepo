import { Controller, Get, Post, Body, UseGuards, Request, Param, Patch, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateCourseNotificationDto } from './dto/create-course-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async createNotification(@Body() createNotificationDto: CreateNotificationDto, @Request() req) {
    return this.notificationsService.createNotification(createNotificationDto, req.user.id);
  }

  @Post('course')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROFESSOR)
  async createCourseNotification(@Body() createNotificationDto: CreateCourseNotificationDto, @Request() req) {
    return this.notificationsService.createCourseNotification(createNotificationDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  @Get('my')
  async getMyNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(parseInt(id), req.user.id);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT_SERVICE)
  async deleteNotification(@Param('id') id: string, @Request() req) {
    return this.notificationsService.deleteNotification(parseInt(id), req.user.id);
  }
}
