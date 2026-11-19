
import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { normalizeCnpj } from './validators/cnpj.validator';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          name: dto.name.trim(),
          cnpj: normalizeCnpj(dto.cnpj),
        },
        select: {
          id: true,
          name: true,
          cnpj: true,
          status: true,
          createdAt: true,
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma empresa cadastrada com este CNPJ.',
        );
      }

      throw error;
    }
  }
}
