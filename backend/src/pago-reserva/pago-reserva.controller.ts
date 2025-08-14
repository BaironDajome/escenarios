import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { PagoReservaService } from './pago-reserva.service';
import { CreatePagoReservaDto } from './dto/create-pago-reserva.dto';
import { NotificacionPagoDto } from './dto/notificacion-pago.dto';

@Controller('pago-reserva')
export class PagoReservaController {
  constructor(private readonly pagoReservaService: PagoReservaService) { }

  // @Post()
  // create(@Body() createPagoReservaDto: CreatePagoReservaDto) {
  //   return this.pagoReservaService.crear(createPagoReservaDto);
  // }
  // @Post('webhook-epayco')
  // @HttpCode(200)
  // async recibirConfirmacion(@Body() body: NotificacionPagoDto) {
  //   await this.pagoReservaService.crear(body);
  // }


}
