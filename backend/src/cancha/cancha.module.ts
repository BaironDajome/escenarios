import { Module } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { CanchaController } from './cancha.controller';
import { Cancha } from './entities/cancha.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscenarioModule } from 'src/escenario/escenario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cancha]),EscenarioModule],
  controllers: [CanchaController],
  providers: [CanchaService],
  exports: [CanchaService],
})
export class CanchaModule { }
