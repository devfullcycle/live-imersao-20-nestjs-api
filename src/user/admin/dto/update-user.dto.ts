import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { RegisterDto } from '../../../auth/dtos/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsString()
  @IsOptional()
  role: string;
}
