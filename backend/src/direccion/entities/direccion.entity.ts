// src/direccion/direccion.entity.ts
import { Persona } from 'src/persona/entities/persona.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Direccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  barrio: string;

  @Column()
  comuna: string;

  @Column()
  calle: string;

  @Column({ nullable: true })
  numero?: string;

  @OneToOne(() => Persona, (persona) => persona.direccion)
  persona: Persona;
}
