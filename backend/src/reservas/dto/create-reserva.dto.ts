import { Type } from 'class-transformer';
import { IsUUID, IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { CreateConteneidoReservaDto } from './create-contenido-reserva.dto';
import { NotificacionPagoDto } from 'src/pago-reserva/dto/notificacion-pago.dto';

export class CreateReservaDto {
  @IsUUID()
  cancha_id: string;

  @IsUUID()
  usuario_id: string;

  @ValidateNested({ each: true })
  @Type(() => NotificacionPagoDto)
  pago: NotificacionPagoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConteneidoReservaDto)
  datos: CreateConteneidoReservaDto[];
}