
import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';

import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        application: 'RH INTELIGENTE',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        application: 'RH INTELIGENTE',
        database: 'disconnected',
      });
    }
  }
}
