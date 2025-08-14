import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Horario } from '../../horarios/entities/horario.entity';
import { Cancha } from 'src/cancha/entities/cancha.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('escenarios')
export class Escenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  imagen_url: string;

  @OneToMany(() => Cancha, cancha => cancha.escenario, { cascade: true })
  canchas: Cancha[];

  @OneToMany(() => Horario, horario => horario.escenario)
  horarios: Horario[];

  @ManyToOne(() => Usuario, usuario => usuario.escenarios, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'usuario_id', // nombre de la columna FK
    foreignKeyConstraintName: 'fk_escenario_usuario', // nombre de la FK
  })
  usuario: Usuario;
}
