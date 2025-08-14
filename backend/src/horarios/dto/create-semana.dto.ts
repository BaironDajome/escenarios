// src/horario/dto/create-horario.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateHorarioDto } from './create-horario.dto';

export class CreateSemanaDto {
  @IsUUID()
  escenario_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHorarioDto)
  horarios: CreateHorarioDto[];
}
