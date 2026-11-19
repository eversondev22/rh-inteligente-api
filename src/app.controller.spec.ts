
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';

import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';

describe('AppController', () => {
  let controller: AppController;

  const prismaMock = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    prismaMock.$queryRaw.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('GET /health', () => {
    it('should return healthy status when database is connected', async () => {
      prismaMock.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const response = await controller.checkHealth();

      expect(response.status).toBe('ok');
      expect(response.application).toBe('RH INTELIGENTE');
      expect(response.database).toBe('connected');
      expect(response.timestamp).toBeDefined();
      expect(Date.parse(response.timestamp)).not.toBeNaN();
    });

    it('should throw ServiceUnavailableException when database fails', async () => {
      prismaMock.$queryRaw.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.checkHealth()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
