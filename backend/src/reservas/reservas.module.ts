import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PagoReserva } from 'src/pago-reserva/entities/pago-reserva.entity';
import { CanchaModule } from 'src/cancha/cancha.module';
import { Escenario } from 'src/escenario/entities/escenario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva,PagoReserva,Escenario]),
    CanchaModule,
    UsuarioModule,
    
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService]
})
export class ReservasModule {}
