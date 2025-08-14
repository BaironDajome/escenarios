// src/persona/persona.entity.ts
import { Direccion } from 'src/direccion/entities/direccion.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Persona {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    documento: string;

    @Column()
    telefono: string;

    @ManyToOne(() => Direccion, direccion => direccion.persona, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'direccion_id', // nombre de la columna FK
        foreignKeyConstraintName: 'fk_persona_direccion', // nombre de la FK
    })
    direccion: Direccion;

    @OneToOne(() => Usuario, (usuario) => usuario.persona)
    usuario: Usuario;

}
