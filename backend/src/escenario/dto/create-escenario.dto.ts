// src/escenario/dto/create-escenario.dto.ts
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { CreateCanchaDto } from './create-canchas.tdo';
import { Type } from 'class-transformer';

export class CreateEscenarioDto {
  @IsString()
  nombre: string;

  @IsString()
  grupo: string;

  @IsString()
  ubicacion: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsString()
  usuario_id: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCanchaDto)
  canchas: CreateCanchaDto[];
}
