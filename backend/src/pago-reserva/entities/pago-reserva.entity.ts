// src/pago-reserva/entities/pago-reserva.entity.ts
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('pagos_reserva')
export class PagoReserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ length: 50 })
  metodo: string; // ejemplo: 'tarjeta', 'bancolombia', 'efectivo'

  @Column({ length: 50 })
  estado: string; // ejemplo: 'pendiente', 'completado', 'fallido'

  @CreateDateColumn()
  fecha_pago: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.pagosReserva, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Reserva, (reserva) => reserva.pagoReserva, { eager: true })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;
}
