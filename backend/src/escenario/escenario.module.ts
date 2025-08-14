import { Module } from '@nestjs/common';
import { EscenarioService } from './escenario.service';
import { EscenarioController } from './escenario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from './entities/escenario.entity';
import { Cancha } from 'src/cancha/entities/cancha.entity';

@Module({
 imports: [
    TypeOrmModule.forFeature([Escenario, Cancha]), 
  ],
  controllers: [EscenarioController],
  providers: [EscenarioService],
  exports: [EscenarioService]
})
export class EscenarioModule {}
