import { Escenario } from './../escenario/entities/escenario.entity';
import { JwtStrategy } from './../Guards/jwt.strategy';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository } from 'typeorm';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PagoReserva } from 'src/pago-reserva/entities/pago-reserva.entity';
import { JwtPayload } from 'src/interfaces/request-with-user.interface';
import { CanchaService } from 'src/cancha/cancha.service';

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva)
        private reservaRepo: Repository<Reserva>,
        @InjectRepository(PagoReserva)
        private pagoRepo: Repository<PagoReserva>,
        @InjectRepository(Escenario)
        private escenarioRepo: Repository<Escenario>,
        private readonly canchaServices: CanchaService,
        private readonly usuarioServices: UsuarioService,
    ) { }

    async crear(dto: CreateReservaDto, user: JwtPayload) {


        if (user.tipo !== "cliente") {
            throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
        }

        // Obtener escenario
        const cancha = await this.canchaServices.obtenerPorId(dto.cancha_id);

        // Obtener usuario
        const usuario = await this.usuarioServices.obtenerPorId(dto.usuario_id);
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Crear las nuevas reservas a partir de los datos
        const nuevasReservas = dto.datos.map((reservaDto) => {
            return this.reservaRepo.create({
                usuario,
                cancha,
                hora_inicio: reservaDto.hora_inicio,
                hora_fin: reservaDto.hora_fin,
                motivo: reservaDto.motivo,
                fecha: reservaDto.fecha,
            });
        });

        // Guardar las reservas
        const reservasGuardadas = await this.reservaRepo.save(nuevasReservas);

        // Decrementar la cantidad disponible del usuario
        await this.usuarioServices.decremento(dto.usuario_id);

        return reservasGuardadas;
    }

    async crearReservaPago(dto: any) {
        if (dto.x_respuesta !== 'Aceptada') {
            throw new BadRequestException('El pago no fue aceptado');
        }

        const cancha = await this.canchaServices.obtenerPorId(dto.x_extra1);
        const usuario = await this.usuarioServices.obtenerPorId(dto.x_extra2);

        // 1. Crear la reserva
        const reserva = this.reservaRepo.create({
            cancha: cancha,
            usuario: usuario,
            motivo: dto.x_extra3,
            hora_inicio: dto.x_extra4,
            hora_fin: dto.x_extra5,
            fecha: dto.x_extra6,
            estado: dto.x_extra7 || 'pendiente',
        });

        const reservaGuardada = await this.reservaRepo.save(reserva);

        // 2. Crear y guardar el pago asociado a la reserva
        const pago = this.pagoRepo.create({
            monto: dto.x_amount,
            metodo: 'Tranferencia',
            estado: 'completado',
            usuario: usuario,
            reserva: reservaGuardada,
        });

        const pagoGuardado = await this.pagoRepo.save(pago);

        return {
            reserva: reservaGuardada,
            pago: pagoGuardado,
        };
    }

    async findAll(user: JwtPayload): Promise<Reserva[]> {
        if (user.tipo !== "cliente" && user.tipo !== "admin") {
            throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
        }

        return this.reservaRepo.find({
            relations: ['escenario', 'usuario', 'usuario.persona'], // incluir persona
            order: {
                fecha: 'DESC',
                hora_inicio: 'ASC',
            },
        });
    }

    async findByCancha(cancha_id: string, user: JwtPayload): Promise<any[]> {
        if (user.tipo !== "cliente" && user.tipo !== "admin") {
            throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
        }

        const reservas = await this.reservaRepo.find({
            where: {
                cancha: {
                    id: cancha_id,
                },
            },
            relations: ['cancha', 'usuario'],
        });

        return reservas.map((r) => ({
            id: r.id,
            motivo: r.motivo,
            estado: r.estado,
            fecha: r.fecha,
            hora_inicio: r.hora_inicio,
            hora_fin: r.hora_fin,
            canchaId: r.cancha.id,
            usuarioId: r.usuario.id,
        }));
    }

    async findByReserva(id: string, user: JwtPayload): Promise<Reserva> {
        if (user.tipo !== "cliente" && user.tipo !== "admin") {
            throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
        }

        const reserva = await this.reservaRepo.findOne({ where: { id } });

        if (!reserva) {
            throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
        }

        return reserva;
    }

    async findByReservaEscenario(user: JwtPayload): Promise<Partial<Reserva>[]> {
        if (user.tipo !== "admin") {
            throw new NotFoundException("El usuario que está intentando acceder no está autorizado");
        }

        // Buscar el escenario asociado al usuario (asumiendo relación usuario.escenarios[])
        const escenario = await this.escenarioRepo
            .createQueryBuilder("escenarios")
            .leftJoin("escenarios.usuario", "usuario")
            .where("usuario.id = :id", { id: user.id })
            .getOne();

        if (!escenario) {
            throw new NotFoundException("No se encontró un escenario asociado al usuario.");
        }

        return this.escenarioRepo
            .createQueryBuilder("escenarios")
            .leftJoin("escenarios.canchas", "cancha")
            .leftJoin("cancha.reservas", "reserva")
            .leftJoin("reserva.usuario", "usuario")
            .leftJoin("usuario.persona", "persona")
            .select([
                'reserva.id AS id',
                'reserva.motivo motivo',
                `TO_CHAR(reserva.fecha, 'YYYY-MM-DD') AS fecha`,
                'reserva.hora_inicio AS hora_inicio',
                'reserva.hora_fin AS hora_fin',
                'reserva.estado As estado',
                'persona.nombres AS nombres',
                'persona.apellidos AS apellidos',
            ])
            .where("escenarios.id = :id", { id: escenario.id })
            .andWhere("reserva.id IS NOT NULL")
            .getRawMany();
    }

    async update(id: string, dto: UpdateReservaDto, user: JwtPayload) {
        if (user.tipo !== "admin") {
            throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
        }

        const reserva = await this.reservaRepo.findOne({ where: { id } });

        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }

        const nuevoContenido = dto.datos[0]; // Suponiendo que es solo un elemento

        if (nuevoContenido.motivo !== undefined) {
            reserva.motivo = nuevoContenido.motivo;
        }

        if (nuevoContenido.hora_inicio !== undefined) {
            reserva.hora_inicio = nuevoContenido.hora_inicio;
        }

        if (nuevoContenido.hora_fin !== undefined) {
            reserva.hora_fin = nuevoContenido.hora_fin;
        }

        if (nuevoContenido.estado !== undefined) {
            reserva.estado = nuevoContenido.estado;
        }

        if (nuevoContenido.fecha !== undefined) {
            reserva.fecha = nuevoContenido.fecha;
        }
        return this.reservaRepo.save(reserva);
    }

    async contarPorEstado(estado: string, user: JwtPayload) {
        if (user.tipo !== "admin") {
            throw new NotFoundException(`El usuario que está intentando acceder no está autorizado`);
        }

        return this.reservaRepo.count({ where: { estado } });
    }

}
