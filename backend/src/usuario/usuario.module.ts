import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Persona } from 'src/persona/entities/persona.entity';
import { Direccion } from 'src/direccion/entities/direccion.entity';
import { CanchaModule } from 'src/cancha/cancha.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona, Direccion]),CanchaModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService]
})
export class UsuarioModule { }
