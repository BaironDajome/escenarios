import { Cancha } from 'src/cancha/entities/cancha.entity';
import { Escenario } from 'src/escenario/entities/escenario.entity';
import { PagoReserva } from 'src/pago-reserva/entities/pago-reserva.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  motivo: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @ManyToOne(() => Cancha, cancha => cancha.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'cancha_id', // nombre de la columna FK
    foreignKeyConstraintName: 'fk_reserva_cancha', // nombre de la FK
  })
  cancha: Cancha;

  @ManyToOne(() => Usuario, usuario => usuario.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'usuario_id', // nombre de la columna FK
    foreignKeyConstraintName: 'fk_reserva_usuario', // nombre de la FK
  })
  usuario: Usuario;

  @OneToMany(() => PagoReserva, (pago) => pago.reserva)
  pagoReserva: PagoReserva[];

}
