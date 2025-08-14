import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagoReservaDto } from './dto/create-pago-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoReserva } from './entities/pago-reserva.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ReservasService } from 'src/reservas/reservas.service';
import { NotificacionPagoDto } from './dto/notificacion-pago.dto';

@Injectable()
export class PagoReservaService {
  constructor(
    @InjectRepository(PagoReserva)
    private readonly pagoRepo: Repository<PagoReserva>,
  ) { }
  
  async crear(dto: NotificacionPagoDto) {
    
    // const usuario = await this.usuarioService.obtenerPorId(dto.x_usuario_id);
    // const reserva = await this.reservaReserva.findByReserva(dto.reserva_id);

    // if (!usuario) {
    //   throw new NotFoundException('Usuario no encontrado');
    // }

    // if (!reserva) {
    //   throw new NotFoundException('Reserva no encontrada');
    // }

    // const pago = this.pagoRepo.create({
    //   monto: dto.monto,
    //   metodo: dto.metodo,
    //   estado: 'completado',
    //   usuario,
    //   reserva,
    // });

    // return this.pagoRepo.save(pago);
  }


}
