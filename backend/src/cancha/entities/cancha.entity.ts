import { Escenario } from "src/escenario/entities/escenario.entity";
import { Reserva } from "src/reservas/entities/reserva.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('canchas')
export class Cancha {
    @PrimaryGeneratedColumn('uuid') // ← CLAVE PRIMARIA OBLIGATORIA
    id: string;

    @Column()
    nombre: string;

    @Column({ default: 'disponible' })
    estado: string;

    @Column()
    ubicacion: string;

    @Column({nullable: true})
    imagen: string;

    @ManyToOne(() => Escenario, escenario => escenario.canchas, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'escenario_id', // nombre de la columna FK
        foreignKeyConstraintName: 'fk_cancha_escenario', // nombre de la FK
    })
    escenario: Escenario;

    @OneToMany(() => Reserva, (reserva) => reserva.cancha)
    reservas: Reserva[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
