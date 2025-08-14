import { Injectable, NotFoundException } from '@nestjs/common';
import { Cancha } from './entities/cancha.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/interfaces/request-with-user.interface';
import { EscenarioService } from 'src/escenario/escenario.service';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Injectable()
export class CanchaService {
  constructor(
    @InjectRepository(Cancha)
    private canchaRepo: Repository<Cancha>,
    private readonly escenarioService: EscenarioService,
  ) { }

  async obtenerPorId(id: string): Promise<Cancha> {
    const cancha = await this.canchaRepo.findOne({ where: { id, isDeleted: false }, relations: ['escenario'] });

    if (!cancha) {
      throw new NotFoundException(`Cancha con ID ${id} no encontrado`);
    }
    return cancha;
  }

  async obtenerCanchasPorEscenario(user: JwtPayload): Promise<any[]> {

    if (user.tipo !== "admin") {
      throw new NotFoundException("El usuario que está intentando acceder no está autorizado");
    }

    const escenario = await this.escenarioService.obtenerEscenarioPorUsuario(user.id);

    return this.canchaRepo
      .createQueryBuilder("canchas")
      .leftJoin("canchas.escenario", "escenario")
      .select([
        'canchas.id AS id',
        'canchas.nombre AS nombre',
        `TO_CHAR(canchas.createdAt, 'YYYY-MM-DD') AS fecha_creacion`,
        'canchas.ubicacion AS ubicacion',
        'canchas.estado AS estado',
        'canchas.isDeleted AS isDeleted'
      ])
      .where("escenario.id = :id", { id: escenario.id })
      .andWhere("canchas.isDeleted = false")
      .andWhere("canchas.id IS NOT NULL")
      .getRawMany();
  }

  async canchasEscenario(escenario_id: string): Promise<Cancha[]> {
    return this.canchaRepo
      .createQueryBuilder("canchas")
      .leftJoin("canchas.escenario", "escenario")
      .select([
        'canchas.id AS id',
        'canchas.nombre AS nombre',
        'canchas.ubicacion AS ubicacion',
        'canchas.estado AS estado'
      ])
      .where("escenario.id = :id", { id: escenario_id })
      .andWhere("canchas.isDeleted = false")
      .andWhere("canchas.estado = 'disponible'")
      .andWhere("canchas.id IS NOT NULL")
      .getRawMany();
  }

  async obtenerCanchas(): Promise<Cancha[]> {
    return this.canchaRepo
      .createQueryBuilder("cancha")
      .where("cancha.estado = :estado", { estado: 'disponible' })
      .getMany();
  }

  async obtenerUnaCanchaInicial(escenario_id?: string): Promise<Cancha> {
    let cancha: Cancha | null;

    if (escenario_id) {
      cancha = await this.canchaRepo.findOne({
        where: { escenario: { id: escenario_id }, isDeleted: false },
        relations: ['escenario'],
        order: { createdAt: 'ASC' } // 🔸 este no tiene efecto con `findOne` en TypeORM >= 0.3
      });
    } else {
      cancha = await this.canchaRepo.find({
        where: { isDeleted: false },
        relations: ['escenario'],
        order: { createdAt: 'ASC' },
        take: 1, // 🔹 devuelve solo una cancha
      }).then(result => result[0] || null);
    }

    if (!cancha) {
      throw new NotFoundException(`No se encontró ninguna cancha`);
    }

    return cancha;
  }

  async update(id: string, dto: UpdateCanchaDto, user: JwtPayload) {
    if (user.tipo !== "admin") {
      throw new NotFoundException("El usuario que está intentando acceder no está autorizado");
    }

    const cancha = await this.canchaRepo.findOne({
      where: {
        id,
        isDeleted: false, // Asegúrate de que delete sea un boolean o número, según tu entidad
      },
    });

    if (!cancha) {
      throw new NotFoundException("Cancha no encontrada");
    }

    // Actualizar solo los campos definidos
    if (dto.nombre !== undefined) cancha.nombre = dto.nombre;
    if (dto.ubicacion !== undefined) cancha.ubicacion = dto.ubicacion;
    if (dto.estado !== undefined) cancha.estado = dto.estado;

    const canchaNueva = await this.canchaRepo.save(cancha);

    return {
      id: canchaNueva.id,
      nombre: canchaNueva.nombre,
      ubicacion: canchaNueva.ubicacion,
      fecha_creacion: canchaNueva.createdAt.toISOString().split('T')[0],
      estado: canchaNueva.estado,
    };
  }

  async EliminadoLogico(id: string, user: JwtPayload) {
    if (user.tipo !== "admin") {
      throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
    }

    const cancha = await this.canchaRepo.findOne({ where: { id } });

    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }
    cancha.isDeleted = false;
    return this.canchaRepo.save(cancha);
  }
}
