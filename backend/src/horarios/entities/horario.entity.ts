import { Escenario } from 'src/escenario/entities/escenario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Escenario, escenario => escenario.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'escenario_id', // nombre de la columna FK
    foreignKeyConstraintName: 'fk_horario_escenario', // nombre de la FK
  })
  escenario: Escenario;

  @Column()
  dia_semana: string; // Lunes, Martes...

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;
}
