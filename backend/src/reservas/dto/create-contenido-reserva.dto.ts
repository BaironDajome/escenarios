import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateConteneidoReservaDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @IsString()
  @IsNotEmpty()
  hora_inicio: string;

  @IsString()
  @IsNotEmpty()
  hora_fin: string;

  @IsString()
  fecha: string;
  
  @IsString()
  @Transform(({ value }) => value ?? 'activo') 
  estado: string;
}
