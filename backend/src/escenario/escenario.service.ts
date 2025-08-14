import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Escenario } from './entities/escenario.entity';
import { Repository } from 'typeorm';
import { Cancha } from 'src/cancha/entities/cancha.entity';
import { JwtPayload } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class EscenarioService {
  constructor(
    @InjectRepository(Escenario)
    private readonly escenarioRepository: Repository<Escenario>,

    @InjectRepository(Cancha)
    private readonly canchasRepository: Repository<Cancha>,
  ) { }

  async crear(data: CreateEscenarioDto | CreateEscenarioDto[], user: JwtPayload): Promise<Escenario | Escenario[]> {
    if (user.tipo !== "admin") {
      throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
    }

    if (Array.isArray(data)) {
      const escenariosCreados: Escenario[] = [];

      for (const item of data) {
        const escenario = this.escenarioRepository.create({
          ...item,
          usuario: { id: item.usuario_id }
        });

        const escenarioGuardado = await this.escenarioRepository.save(escenario);
        escenariosCreados.push(escenarioGuardado);
      }

      return escenariosCreados;
    } else {
      const escenario = this.escenarioRepository.create({
        ...data,
        usuario: { id: data.usuario_id }
      });
      const escenarioGuardado = await this.escenarioRepository.save(escenario);
      return escenarioGuardado;
    }
  }


  async obtenerTodos(user: JwtPayload): Promise<Escenario[]> {
    
    if (user.tipo !== "cliente") {
      throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
    }

    return this.escenarioRepository.find({
      relations: ['canchas'],
    });
  }

  async obtenerEscenarioPorUsuario(usuario_id: string): Promise<Escenario> {
    const escenario = await this.escenarioRepository
      .createQueryBuilder("escenarios")
      .leftJoin("escenarios.usuario", "usuario")
      .where("usuario.id = :id", { id: usuario_id })
      .getOne();

    if (!escenario) {
      throw new NotFoundException("No se encontró un escenario asociado al usuario.");
    }
    return escenario;
  }

  async obtenerPorId(id: string): Promise<Escenario> {
    const escenario = await this.escenarioRepository.findOne({ where: { id } });

    if (!escenario) {
      throw new NotFoundException(`Escenario con ID ${id} no encontrado`);
    }

    return escenario;
  }
}
