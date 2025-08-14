import { Module } from '@nestjs/common';
import { PagoReservaService } from './pago-reserva.service';
import { PagoReservaController } from './pago-reserva.controller';
import { PagoReserva } from './entities/pago-reserva.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PagoReserva])],
  controllers: [PagoReservaController],
  providers: [PagoReservaService],
  exports: [PagoReservaService]

})
export class PagoReservaModule { }
