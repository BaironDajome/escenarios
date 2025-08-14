// src/horario/dto/create-horario.dto.ts
import { IsString, IsUUID } from 'class-validator';

export class CreateHorarioDto {
  @IsString()
  dia_semana: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;
}
