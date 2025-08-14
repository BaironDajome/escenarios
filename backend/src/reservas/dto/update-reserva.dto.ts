import { Type } from 'class-transformer';
import { IsUUID, IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { UpdateContenidoReservaDto } from './update-contenido-reserva.dto';

export class UpdateReservaDto {
  
  @IsOptional()
  @IsUUID()
  cancha_id?: string;

  @IsOptional()
  @IsUUID()
  usuario_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateContenidoReservaDto)
  datos: UpdateContenidoReservaDto[];
}