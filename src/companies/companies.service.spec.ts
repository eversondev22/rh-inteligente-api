
import { ConflictException } from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { PrismaService } from '../database/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const prismaMock = {
    company: {
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new CompaniesService(
      prismaMock as unknown as PrismaService,
    );
  });

  describe('create', () => {
    const companyDto = {
      name: '  Empresa Teste  ',
      cnpj: '11.222.333/0001-81',
    };

    it('should create a company with normalized data', async () => {
      const expectedCompany = {
        id: 'company-id',
        name: 'Empresa Teste',
        cnpj: '11222333000181',
        status: 'ACTIVE',
        createdAt: new Date(),
      };

      prismaMock.company.create.mockResolvedValue(
        expectedCompany,
      );

      const result = await service.create(companyDto);

      expect(prismaMock.company.create).toHaveBeenCalledWith({
        data: {
          name: 'Empresa Teste',
          cnpj: '11222333000181',
        },
        select: {
          id: true,
          name: true,
          cnpj: true,
          status: true,
          createdAt: true,
        },
      });

      expect(result).toEqual(expectedCompany);
    });

    it('should reject duplicate CNPJ', async () => {
      prismaMock.company.create.mockRejectedValue({
        code: 'P2002',
      });

      await expect(
        service.create(companyDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should propagate unexpected database errors', async () => {
      const databaseError = new Error('Database unavailable');

      prismaMock.company.create.mockRejectedValue(
        databaseError,
      );

      await expect(
        service.create(companyDto),
      ).rejects.toThrow(databaseError);
    });
  });
});
