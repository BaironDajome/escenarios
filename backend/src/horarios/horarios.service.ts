import { Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity';
import { EscenarioService } from 'src/escenario/escenario.service';
import { CreateSemanaDto } from './dto/create-semana.dto';

@Injectable()
export class HorariosService {
    constructor(
        @InjectRepository(Horario)
        private horarioRepo: Repository<Horario>,
        private readonly escenarioServices: EscenarioService
    ) { }

    async crear(data: CreateSemanaDto) {
        const escenario = await this.escenarioServices.obtenerPorId(data.escenario_id);
        const nuevosHorarios = data.horarios.map(h => {
            return this.horarioRepo.create({
                escenario,
                dia_semana: h.dia_semana,
                hora_inicio: h.hora_inicio,
                hora_fin: h.hora_fin,
            });
        });

        return this.horarioRepo.save(nuevosHorarios);
    }
}
