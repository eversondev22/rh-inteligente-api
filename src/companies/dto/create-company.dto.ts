
import { Transform } from 'class-transformer';

import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { IsCnpj } from '../validators/cnpj.validator';

export class CreateCompanyDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name: string;

  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/[.\-/\s]/g, '').toUpperCase()
      : value,
  )
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  @Matches(/^[A-Z0-9]{12}\d{2}$/)
  @IsCnpj()
  cnpj: string;
}
