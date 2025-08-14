import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoReservaDto } from './create-pago-reserva.dto';

export class UpdatePagoReservaDto extends PartialType(CreatePagoReservaDto) {}
