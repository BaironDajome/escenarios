import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Persona } from 'src/persona/entities/persona.entity';
import { Direccion } from 'src/direccion/entities/direccion.entity';
import { JwtPayload } from 'src/interfaces/request-with-user.interface';
import { CanchaService } from 'src/cancha/cancha.service';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        @InjectRepository(Persona)
        private readonly personaRepo: Repository<Persona>,

        @InjectRepository(Direccion)
        private readonly direccionRepo: Repository<Direccion>,
        private readonly canchaService: CanchaService,
    ) { }

    @Cron('0 0 * * 1') // Lunes a las 00:00
    async resetearContador() {
        //🕐 Ejecutando tarea semanal: reiniciar contador de reservas
        await this.usuarioRepo.update({}, { cantidad_reserva: 1 });
    }

    async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
        const { email, password, persona } = createUsuarioDto;

        // Verificar si ya existe un usuario con ese email
        const usuarioExistente = await this.usuarioRepo.findOne({ where: { email } });
        if (usuarioExistente) {
            throw new BadRequestException('El correo ya está registrado.');
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear y guardar la dirección
        const nuevaDireccion = this.direccionRepo.create(persona.direccion);
        const direccionGuardada = await this.direccionRepo.save(nuevaDireccion);

        // Crear y guardar la persona con dirección
        const nuevaPersona = this.personaRepo.create({
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            documento: persona.documento,
            telefono: persona.telefono,
            direccion: direccionGuardada,
        });
        const personaGuardada = await this.personaRepo.save(nuevaPersona);

        // Crear y guardar el usuario
        const nuevoUsuario = this.usuarioRepo.create({
            email,
            password: hashedPassword,
            persona: personaGuardada,
        });

        return this.usuarioRepo.save(nuevoUsuario);
    }

    async obtenerPorId(id: string): Promise<Usuario> {
        const usuario = await this.usuarioRepo.findOne({ where: { id } });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return usuario;
    }

    async decremento(id: string) {
        const usuario = await this.usuarioRepo.findOne({
            where: { id },
            relations: ['persona'], // si quieres más info
        });

        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        usuario.cantidad_reserva = Math.max(0, usuario.cantidad_reserva - 1);

        // Guarda los cambios en la base de datos
        await this.usuarioRepo.save(usuario);

        return {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.persona.nombres,
                tipo: usuario.tipo,
                cantidad_reserva: usuario.cantidad_reserva,
            }
        };
    }

    async obtenerUsuarioActualizado(user: JwtPayload) {

        if (user.tipo !== 'admin' && user.tipo !== 'cliente') {
            throw new ForbiddenException('El usuario no está autorizado');
        }

        const usuario = await this.usuarioRepo.findOne({
            where: { id: user.id },
            relations: ['persona', 'escenarios', 'escenarios.canchas'],
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const escenariosConCanchas = await Promise.all(
            (usuario.escenarios ?? []).map(async (e) => ({
                id: e.id,
                nombre: e.nombre,
                descripcion: e.descripcion,
                canchas: await this.canchaService.canchasEscenario(e.id),
            }))
        );

        return {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.persona?.nombres ?? null,
                apellido: usuario.persona?.apellidos ?? null,
                tipo: usuario.tipo,
                cantidad_reserva: usuario.cantidad_reserva ?? 0,
                escenario: escenariosConCanchas,
            },
        };
    }

    async obtenerUsuarioPorCorreo(email: string) {
        const usuario = await this.usuarioRepo.findOne({
            where: { email },
            relations: ['persona', 'escenarios'],
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;

    }
}
