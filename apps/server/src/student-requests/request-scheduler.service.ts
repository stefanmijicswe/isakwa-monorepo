import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RequestRoutingService } from './request-routing.service';

@Injectable()
export class RequestSchedulerService {
  private readonly logger = new Logger(RequestSchedulerService.name);

  constructor(private requestRoutingService: RequestRoutingService) {}

  /**
   * Runs every day at 9 AM to check for overdue requests
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleOverdueRequests() {
    this.logger.log('Checking for overdue requests...');
    
    try {
      await this.requestRoutingService.checkAndEscalateOverdueRequests();
      this.logger.log('Overdue request check completed successfully');
    } catch (error) {
      this.logger.error('Error during overdue request check:', error);
    }
  }

  /**
   * Runs every hour during business hours (9 AM - 5 PM) to check urgent requests
   */
  @Cron('0 9-17 * * 1-5') // Every hour from 9 AM to 5 PM, Monday to Friday
  async handleUrgentRequestsCheck() {
    this.logger.log('Checking for urgent requests needing attention...');
    
    try {
      // This could include checking for requests that haven't been updated recently
      // or complaints that need immediate attention
      this.logger.log('Urgent request check completed');
    } catch (error) {
      this.logger.error('Error during urgent request check:', error);
    }
  }
}
