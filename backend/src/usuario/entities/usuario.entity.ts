import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Persona } from 'src/persona/entities/persona.entity';
import { PagoReserva } from 'src/pago-reserva/entities/pago-reserva.entity';
import { Escenario } from 'src/escenario/entities/escenario.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'cliente' })
    tipo: string;

    @Column({ type: 'int', default: 1 })
    cantidad_reserva: number;

    @ManyToOne(() => Persona, persona => persona.usuario, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'persona_id', // nombre de la columna FK
        foreignKeyConstraintName: 'fk_usuario_persona', // nombre de la FK
    })
    persona: Persona;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;

    @OneToMany(() => Reserva, reserva => reserva.usuario)
    reservas: Reserva[];

    @OneToMany(() => PagoReserva, (pago) => pago.usuario)
    pagosReserva: PagoReserva[];

    @OneToMany(() => Escenario, escenario => escenario.usuario)
    escenarios: Escenario[];

}
